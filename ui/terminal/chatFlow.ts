import { useMemo, useState } from "react";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { SystemAIService, type Message } from "../../src/system/systemService.js";
import { MemoryManagement } from "../../src/memory/mem.js";
import { System, MODEL } from "../../src/config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEMORY_DIR = path.resolve(__dirname, "../../.memoryChatSession");

export type ChatTurn = {
    role: "user" | "assistant" | "system";
    content: string;
};

const generateSessionNumber = (): number =>
    Math.floor(Math.random() * (9000 + 1));

export const useChatFlow = () => {
    const memoryManagement = useMemo(() => new MemoryManagement(), []);
    const systemService = useMemo(() => new SystemAIService(), []);

    const sessionID = useMemo(() => generateSessionNumber(), []);
    const sessionFile = useMemo(() => {
        const file = path.join(MEMORY_DIR, `${sessionID}.json`);
        memoryManagement.initMemory(file);
        return file;
    }, [memoryManagement, sessionID]);

    const [turns, setTurns] = useState<ChatTurn[]>([]);
    const [busy, setBusy] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const clear = () => {
        setTurns([]);
    };

    const sendMessage = async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;

        setError(null);
        setBusy(true);

        const nextTurns: ChatTurn[] = [
            ...turns,
            { role: "user", content: trimmed },
        ];
        setTurns(nextTurns);

        try {
            const history = memoryManagement.readFiles(sessionFile) || [];
            const priorMessages: Message[] = history.flatMap(
                (entry: { user: string; output: string }) => [
                    { role: "user" as const, content: entry.user },
                    { role: "assistant" as const, content: entry.output },
                ]
            );

            const reply = await systemService.ollamaIntelligence(
                trimmed,
                priorMessages
            );

            setTurns([
                ...nextTurns,
                { role: "assistant", content: reply },
            ]);

            memoryManagement.writeFile(sessionFile, trimmed, reply);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setError(message);
        } finally {
            setBusy(false);
        }
    };

    return {
        turns,
        busy,
        error,
        sessionID,
        modelName: MODEL,
        hostName: System.SystemName,
        clear,
        sendMessage,
    };
};
