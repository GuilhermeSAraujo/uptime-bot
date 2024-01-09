import {
    CurrentSession,
    TimeTrackExitFilterParam,
    TimeTrackFilterParam,
    OnlineUserTimeTrack,
    UpdateDurationParam,
    GetUserUptimeParam,
    UserUptime
} from "../models/timeTrack";
import { pool } from "./dbClient";

const createEntry = async ({ userId, serverId }: TimeTrackFilterParam) => {
    await pool.query(`
        INSERT INTO time_track (person_id, server_id, enter_time) VALUES ($1, $2, NOW())`,
        [userId, serverId]
    );
};

const getCurrentSession = async ({ userId, serverId }: TimeTrackFilterParam): Promise<CurrentSession | undefined> => {

    const timeTrack = await pool.query(`
        SELECT id, enter_time as "enterTime" FROM time_track WHERE person_id = $1 AND server_id = $2 AND leave_time IS NULL`, [userId, serverId]);

    return timeTrack.rows[0];
};

const createExit = async ({ id, duration }: TimeTrackExitFilterParam) => {
    await pool.query(`
        UPDATE time_track SET duration = $1, leave_time = NOW()
        WHERE id = $2`,
        [duration, id]);
};

const getOnlineUsers = async (): Promise<OnlineUserTimeTrack[]> => {
    const response = await pool.query(`
        SELECT id, person_id AS "personId", server_id AS "serverId", enter_time AS "enterTime", duration
        FROM time_track
        WHERE leave_time IS NULL`
    );

    return response.rows;
};

const updateDuration = async ({ id, duration }: UpdateDurationParam) => {
    await pool.query(`
        UPDATE time_track SET duration = $1
        WHERE id = $2`,
        [duration, id]);
};

const getUserUptime = async ({ userId, serverId }: GetUserUptimeParam): Promise<number> => {
    const serverUptime = await pool.query(`
        SELECT SUM(duration) as "serverUptime"
        FROM time_track
        WHERE person_id = $1 AND server_id = $2
        GROUP BY person_id, server_id`,
        [userId, serverId]);

    return serverUptime.rows[0].serverUptime;
}

const getAllServerUptime = async (userId: string): Promise<number> => {
    const serverUptime = await pool.query(`
        SELECT SUM(duration) as "totalUptime"
        FROM time_track
        WHERE person_id = $1
        GROUP BY person_id`,
        [userId]);

    return serverUptime.rows[0].totalUptime;
}

const getAllUsersFromServerUptime = async (serverId: string): Promise<UserUptime[]> => {
    const users = await pool.query(`
        SELECT p.display_name as "displayName", SUM(t.duration) as "totalMinutesOnline"
        FROM time_track t
        JOIN person p ON t.person_id = p.id
        WHERE t.server_id = $1
        GROUP BY p.display_name
        ORDER BY "totalMinutesOnline" DESC
        LIMIT 10`,
        [serverId]);

    return users.rows;
};

export {
    createEntry,
    getCurrentSession,
    createExit,
    getOnlineUsers,
    updateDuration,
    getUserUptime,
    getAllServerUptime,
    getAllUsersFromServerUptime
}