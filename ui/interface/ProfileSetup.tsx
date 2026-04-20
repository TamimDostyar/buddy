import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { UserProfile } from "../../src/system/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type Field = {
    key: string;
    label: string;
    help?: string;
    type: "text" | "select";
    options?: string[];
};

type Props = {
    onComplete: (profile: Record<string, string>) => void;
};

const ORDER = [
    "userProfile",
    "userRole",
    "userAIchoice",
    "userPrimaryLanguage",
    "useraltChoice",
] as const;

export const ProfileSetup: React.FC<Props> = ({ onComplete }) => {
    const { exit } = useApp();
    const [fields, setFields] = useState<Field[] | null>(null);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [textValue, setTextValue] = useState("");
    const [selectIdx, setSelectIdx] = useState(0);
    const [loadError, setLoadError] = useState<string | null>(null);

    const profilePath = useMemo(
        () => path.resolve(__dirname, "../../profile/profile.json"),
        []
    );

    useEffect(() => {
        (async () => {
            const schema = await new UserProfile().createProfile();
            if (typeof schema === "string") {
                setLoadError(schema);
                return;
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
            setFields(collected);
        })();
    }, []);

    useInput(
        (_ch, key) => {
            if (!fields) return;
            const current = fields[idx];
            if (!current || current.type !== "select") return;

            if (key.upArrow) {
                setSelectIdx((i) =>
                    i <= 0 ? (current.options?.length ?? 1) - 1 : i - 1
                );
            } else if (key.downArrow) {
                setSelectIdx((i) =>
                    i >= (current.options?.length ?? 1) - 1 ? 0 : i + 1
                );
            } else if (key.return) {
                commit(current.options?.[selectIdx] ?? "");
            }
        },
        { isActive: !!fields }
    );

    const commit = (value: string) => {
        if (!fields) return;
        const current = fields[idx];
        if (!current) return;
        const nextAnswers = { ...answers, [current.key]: value };
        setAnswers(nextAnswers);
        setTextValue("");
        setSelectIdx(0);

        if (idx + 1 >= fields.length) {
            fs.mkdirSync(path.dirname(profilePath), { recursive: true });
            fs.writeFileSync(profilePath, JSON.stringify(nextAnswers, null, 2));
            onComplete(nextAnswers);
        } else {
            setIdx(idx + 1);
        }
    };

    if (loadError) {
        return (
            <Box flexDirection="column">
                <Text color="red">failed to load profile schema:</Text>
                <Text>{loadError}</Text>
            </Box>
        );
    }

    if (!fields) {
        return (
            <Box>
                <Text color="gray">loading profile schema...</Text>
            </Box>
        );
    }

    const current = fields[idx];
    if (!current) return null;

    return (
        <Box flexDirection="column">
            <Gradient name="pastel">
                <BigText text="buddy" font="tiny" />
            </Gradient>
            <Text color="gray">let's get you set up. ({idx + 1}/{fields.length})</Text>

            <Box
                borderStyle="round"
                borderColor="cyan"
                flexDirection="column"
                paddingX={1}
                marginTop={1}
            >
                <Text bold color="cyan">
                    {current.label}
                </Text>
                {current.help ? (
                    <Text color="gray" dimColor>
                        {current.help}
                    </Text>
                ) : null}

                <Box marginTop={1} flexDirection="column">
                    {current.type === "select" ? (
                        <SelectList
                            options={current.options ?? []}
                            selectedIdx={selectIdx}
                        />
                    ) : (
                        <Box>
                            <Text color="cyan">{"› "}</Text>
                            <TextInput
                                value={textValue}
                                onChange={setTextValue}
                                onSubmit={(v) => commit(v.trim())}
                                placeholder="type your answer..."
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            <Box marginTop={1} paddingX={1}>
                <Text color="gray" dimColor>
                    {current.type === "select"
                        ? "↑/↓ to navigate · enter to select"
                        : "enter to continue"}
                </Text>
            </Box>
        </Box>
    );
};

const SelectList: React.FC<{
    options: string[];
    selectedIdx: number;
}> = ({ options, selectedIdx }) => (
    <Box flexDirection="column">
        {options.map((opt, i) => {
            const selected = i === selectedIdx;
            return selected ? (
                <Text key={opt} color="cyan">
                    {"› "}
                    {opt}
                </Text>
            ) : (
                <Text key={opt}>
                    {"  "}
                    {opt}
                </Text>
            );
        })}
    </Box>
);

export default ProfileSetup;
