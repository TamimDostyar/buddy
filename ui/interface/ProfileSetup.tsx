import React from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import type { Field } from "./profileFlow.js";

type Props = {
    fields: Field[] | null;
    idx: number;
    selectIdx: number;
    textValue: string;
    loadError: string | null;
    onTextChange: (value: string) => void;
    onTextSubmit: (value: string) => void;
    onMoveSelect: (delta: number) => void;
    onCommitSelect: () => void;
};

export const ProfileSetup: React.FC<Props> = ({
    fields,
    idx,
    selectIdx,
    textValue,
    loadError,
    onTextChange,
    onTextSubmit,
    onMoveSelect,
    onCommitSelect,
}) => {

    useInput(
        (_ch, key) => {
            if (!fields) return;
            const current = fields[idx];
            if (!current || current.type !== "select") return;

            if (key.upArrow) {
                onMoveSelect(-1);
            } else if (key.downArrow) {
                onMoveSelect(1);
            } else if (key.return) {
                onCommitSelect();
            }
        },
        { isActive: !!fields }
    );

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
                                onChange={onTextChange}
                                onSubmit={(v) => onTextSubmit(v.trim())}
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
