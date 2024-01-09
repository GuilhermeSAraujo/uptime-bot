interface TimeTrack {
    id: string,
    personId: string,
    serverId: string,
    enterTime: Date,
    leaveTime?: Date,
    duration?: Date
};

interface TimeTrackFilterParam {
    userId: string;
    serverId: string;
}

interface TimeTrackExitFilterParam {
    id: string;
    duration: number
};

interface CurrentSession {
    id: string;
    enterTime: Date
}

interface OnlineUserTimeTrack {
    id: number;
    personId: string;
    serverId: string;
    enterTime: Date;
    duration: number;
}

interface UpdateDurationParam {
    id: number;
    duration: number;
}

interface GetUserUptimeParam {
    userId: string;
    serverId: string;
}

interface UserUptime {
    displayName: string;
    totalMinutesOnline: number;
};

export {
    TimeTrack,
    TimeTrackFilterParam,
    CurrentSession,
    TimeTrackExitFilterParam,
    OnlineUserTimeTrack,
    UpdateDurationParam,
    GetUserUptimeParam,
    UserUptime
}