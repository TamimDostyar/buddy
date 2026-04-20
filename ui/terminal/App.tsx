import React, { useMemo, useState } from "react";
import { Box, Text, useApp, useInput, useStdout } from "ink";
import TextInput from "ink-text-input";
import Spinner from "ink-spinner";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { SystemAIService, type Message } from "../../src/system/systemService.js";
import { MemoryManagement } from "../../src/memory/mem.js";
import { System, MODEL } from "../../src/config/config.js";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";


marked.use(markedTerminal() as never);

const renderMarkdown = (src: string): string => {
    const out = marked.parse(src ?? "", { async: false }) as string;
    return out.replace(/\n+$/, "");
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEMORY_DIR = path.resolve(__dirname, "../../.memoryChatSession");

type ChatTurn = {
    role: "user" | "assistant" | "system";
    content: string;
};

type Props = {
    profileName?: string | undefined;
};

const generateSessionNumber = (): number =>
    Math.floor(Math.random() * (9000 + 1));

export const App: React.FC<Props> = ({ profileName }) => {
    const { exit } = useApp();
    const { stdout } = useStdout();

    const memoryManagement = useMemo(() => new MemoryManagement(), []);
    const systemService = useMemo(() => new SystemAIService(), []);

    const sessionID = useMemo(() => generateSessionNumber(), []);
    const sessionFile = useMemo(() => {
        const file = path.join(MEMORY_DIR, `${sessionID}.json`);
        memoryManagement.initMemory(file);
        return file;
    }, [memoryManagement, sessionID]);

    const [input, setInput] = useState<string>("");
    const [turns, setTurns] = useState<ChatTurn[]>([]);
    const [busy, setBusy] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const cols = stdout?.columns ?? 80;
    const bodyWidth = Math.max(40, Math.min(cols - 2, 120));

    useInput((_char, key) => {
        if (key.ctrl && _char === "c") {
            exit();
        }
    });

    const handleSubmit = async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;

        if (trimmed === ":q" || trimmed === "/quit" || trimmed === "/exit") {
            exit();
            return;
        }

        if (trimmed === "/clear") {
            setTurns([]);
            setInput("");
            return;
        }

        setInput("");
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
            const message =
                err instanceof Error ? err.message : "Unknown error";
            setError(message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Box flexDirection="column" width={bodyWidth}>
            <Header width={bodyWidth} />
            <StatusBar
                sessionID={sessionID}
                profileName={profileName}
            />

            <Box
                flexDirection="column"
                borderStyle="round"
                borderColor="gray"
                paddingX={1}
                marginTop={1}
                minHeight={8}
            >
                {turns.length === 0 && !busy ? (
                    <WelcomeHint profileName={profileName} />
                ) : (
                    turns.map((turn, idx) => (
                        <TurnView key={idx} turn={turn} />
                    ))
                )}

                {busy && (
                    <Box marginTop={1}>
                        <Text color="cyan">
                            <Spinner type="dots" />
                        </Text>
                        <Text color="gray"> generating...</Text>
                    </Box>
                )}
            </Box>

            {error && (
                <Box marginTop={1}>
                    <Text color="red">! {error}</Text>
                </Box>
            )}

            <Box
                borderStyle="round"
                borderColor={busy ? "gray" : "cyan"}
                paddingX={1}
                marginTop={1}
            >
                <Text color={busy ? "gray" : "cyan"}>{"› "}</Text>
                <TextInput
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    placeholder={
                        busy
                            ? "waiting for response..."
                            : "ask buddy anything (/quit to exit)"
                    }
                    focus={!busy}
                />
            </Box>

            <Box marginTop={0} paddingX={1}>
                <Text color="gray" dimColor>
                    enter to send · /clear to reset · /quit or :q to exit ·
                    ctrl+c to force quit
                </Text>
            </Box>
        </Box>
    );
};

const Header: React.FC<{ width: number }> = ({ width }) => (
    <Box flexDirection="column" width={width}>
        <Box flexDirection="row" justifyContent="center" width={width}>
            <Gradient name="pastel">
       
                <BigText text="buddy" font="block" />
            </Gradient>
        </Box>
        <Box flexDirection="row" justifyContent="center" width={width}>
            <Text color="gray" dimColor>── BuddyCLI · First AI Integrated OS ──</Text>
        </Box>
    </Box>
);

const StatusBar: React.FC<{
    sessionID: number;
    profileName?: string | undefined;
}> = ({ sessionID, profileName }) => (
    <Box marginTop={1}>
        <Text color="gray">session </Text>
        <Text color="magenta">#{sessionID}</Text>
        <Text color="gray"> · model </Text>
        <Text color="green">{MODEL}</Text>
        <Text color="gray"> · host </Text>
        <Text color="yellow">{System.SystemName}</Text>
        {profileName ? (
            <>
                <Text color="gray"> · </Text>
                <Text color="cyan">{profileName}</Text>
            </>
        ) : null}
    </Box>
);

const WelcomeHint: React.FC<{ profileName?: string | undefined }> = ({
    profileName,
}) => (
    <Box flexDirection="column">
        <Text>
            <Text color="cyan">Hey{profileName ? ` ${profileName}` : ""}</Text>
            <Text color="gray">, ready when you are.</Text>
        </Text>
        <Text color="gray" dimColor>
            Type a message below and hit enter!
        </Text>
    </Box>
);

const TurnView: React.FC<{ turn: ChatTurn }> = ({ turn }) => {
    const isUser = turn.role === "user";
    const label = isUser ? "you" : "buddy";
    const color = isUser ? "cyan" : "magenta";
    const marker = isUser ? "›" : "◆";

    const body = isUser ? turn.content : renderMarkdown(turn.content);

    return (
        <Box flexDirection="column" marginTop={1}>
            <Text color={color} bold>
                {marker} {label}
            </Text>
            <Box paddingLeft={2} flexDirection="column">
                <Text>{body}</Text>
            </Box>
        </Box>
    );
};

export default App;
