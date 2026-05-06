#!/usr/bin/env tsx
import React from "react";
import { render } from "ink";

import { App } from "./App.js";
import { ProfileSetup } from "../interface/ProfileSetup.js";
import { useProfileSetupFlow, useProfileState } from "../interface/profileFlow.js";
import { useChatFlow } from "./chatFlow.js";

const Root: React.FC = () => {
    const { profile, setProfile } = useProfileState();
    const profileFlow = useProfileSetupFlow((p) => setProfile(p));

    if (!profile) {
        return (
            <ProfileSetup
                fields={profileFlow.fields}
                idx={profileFlow.idx}
                selectIdx={profileFlow.selectIdx}
                textValue={profileFlow.textValue}
                loadError={profileFlow.loadError}
                isUpdating={profileFlow.isUpdating}
                answers={profileFlow.answers}
                onTextChange={profileFlow.setTextValue}
                onTextSubmit={profileFlow.commit}
                onMoveSelect={profileFlow.moveSelect}
                onCommitSelect={profileFlow.commitSelected}
            />
        );
    }

    return (
        <ChatRoot 
            profileName={profile["userProfile"]} 
            onRequireUpdate={() => {
                profileFlow.reset();
                setProfile(null);
            }} 
        />
    );
};

const ChatRoot: React.FC<{ profileName?: string | undefined, onRequireUpdate?: () => void }> = ({ profileName, onRequireUpdate }) => {
    const chat = useChatFlow();

    return (
        <App
            profileName={profileName}
            turns={chat.turns}
            busy={chat.busy}
            error={chat.error}
            sessionID={chat.sessionID}
            modelName={chat.modelName}
            hostName={chat.hostName}
            onSend={chat.sendMessage}
            onClear={chat.clear}
            onUpdate={onRequireUpdate}
        />
    );
};

render(<Root />, { exitOnCtrlC: true });
