import { useEffect, useMemo, useState } from "react";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { UserProfile } from "../../src/system/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROFILE_PATH = path.resolve(__dirname, "../../profile/profile.json");

export type Field = {
    key: string;
    label: string;
    help?: string;
    type: "text" | "select";
    options?: string[];
};

const ORDER = [
    "userProfile",
    "userRole",
    "userAIchoice",
    "userPrimaryLanguage",
    "useraltChoice",
    "localArea",
] as const;

const loadProfileFields = async (): Promise<Field[] | string> => {
    const schema = await new UserProfile().createProfile();
    if (typeof schema === "string") {
        return schema;
    }

    const collected: Field[] = [];
    const schemaRecord = schema as unknown as Record<string, unknown>;
    for (const key of ORDER) {
        const f = schemaRecord[key] as
            | {
                  label: string;
                  help?: string;
                  type: "text" | "select";
                  options?: string[];
              }
            | undefined;
        if (!f) continue;
        collected.push({
            key,
            label: f.label,
            help: f.help ?? "",
            type: f.type,
            options: f.options ?? [],
        });
    }

    return collected;
};

const saveProfile = (profile: Record<string, string>): void => {
    fs.mkdirSync(path.dirname(PROFILE_PATH), { recursive: true });
    fs.writeFileSync(PROFILE_PATH, JSON.stringify(profile, null, 2));
};

const readProfile = (): Record<string, string> | null => {
    if (!fs.existsSync(PROFILE_PATH)) return null;
    const raw = fs.readFileSync(PROFILE_PATH, "utf-8");
    if (!raw || raw.trim().length === 0) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const useProfileState = () => {
    const [profile, setProfile] = useState<Record<string, string> | null>(
        readProfile()
    );

    return { profile, setProfile };
};

export const useProfileSetupFlow = (
    onComplete: (profile: Record<string, string>) => void
) => {
    const [fields, setFields] = useState<Field[] | null>(null);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [textValue, setTextValue] = useState("");
    const [selectIdx, setSelectIdx] = useState(0);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const loaded = await loadProfileFields();
            if (typeof loaded === "string") {
                setLoadError(loaded);
                return;
            }
            setFields(loaded);
        })();
    }, []);

    const commit = useMemo(() => {
        return (value: string) => {
            if (!fields) return;
            const current = fields[idx];
            if (!current) return;
            const nextAnswers = { ...answers, [current.key]: value };
            setAnswers(nextAnswers);
            setTextValue("");
            setSelectIdx(0);

            if (idx + 1 >= fields.length) {
                saveProfile(nextAnswers);
                onComplete(nextAnswers);
            } else {
                setIdx(idx + 1);
            }
        };
    }, [answers, fields, idx, onComplete]);

    const moveSelect = (delta: number) => {
        if (!fields) return;
        const current = fields[idx];
        if (!current || current.type !== "select") return;
        const total = current.options?.length ?? 1;
        setSelectIdx((currentIdx) => {
            const next = (currentIdx + delta + total) % total;
            return next;
        });
    };

    const commitSelected = () => {
        if (!fields) return;
        const current = fields[idx];
        if (!current || current.type !== "select") return;
        commit(current.options?.[selectIdx] ?? "");
    };

    return {
        fields,
        idx,
        selectIdx,
        textValue,
        loadError,
        setTextValue,
        commit,
        moveSelect,
        commitSelected,
    };
};
