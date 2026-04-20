#!/usr/bin/env tsx
import React, { useState } from "react";
import { render } from "ink";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { App } from "./App.js";
import { ProfileSetup } from "../interface/ProfileSetup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROFILE_PATH = path.resolve(__dirname, "../../profile/profile.json");

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

const Root: React.FC = () => {
    const [profile, setProfile] = useState<Record<string, string> | null>(
        readProfile()
    );

    if (!profile) {
        return <ProfileSetup onComplete={(p) => setProfile(p)} />;
    }

    return <App profileName={profile["userProfile"]} />;
};

render(<Root />, { exitOnCtrlC: true });
