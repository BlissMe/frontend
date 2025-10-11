import { useEffect, useState } from "react";
import { getLocalStoragedata } from "../../helpers/Storage";
import { overviewData, recentSalesData, topProducts } from "./Constants";

import {
  Activity,
  CreditCard,
  DollarSign,
  HeartPulse,
  Package,
  PencilLine,
  Star,
  Trash,
  TrendingUp,
  Users,
} from "lucide-react";
import axios from "axios";
import { Progress, Tag, Typography } from "antd";

const levelColor = (lvl?: string) => {
  switch ((lvl || "").toLowerCase()) {
    case "minimal":
      return "green";
    case "moderate":
      return "gold";
    case "severe":
      return "red";
    default:
      return "default";
  }
};
interface User {
  userID: number;
  nickname: string;
  virtualCharacter: string;
  inputMode: string;
  level?: string;
  R_value?: number;
  createdAt?: string;
  components?: {
    classifier?: {
      emotion?: string;
    };
  };
  cutoffs?: {
    minimal_max: number;
    moderate_max: number;
  };
}

interface GetPreferencesResponse {
  message: string;
  preferences: {
    users: User[];
  };
}

const DoctorDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const url = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchAllUsers();
    fetchLevelDetection();
  }, [url]);
  const fetchAllUsers = async () => {
    const token = getLocalStoragedata("token");

    try {
      const response = await axios.get<GetPreferencesResponse>(
        `${url}/api/blissme/all-preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      console.log("Fetched users:", response.data.preferences.users);

      setUsers(response.data.preferences.users);
    } catch (error: any) {
      console.error("Error fetching characters:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchLevelDetection = async () => {
    const token = getLocalStoragedata("token");

    try {
      const res = await axios.get<{
        success: boolean;
        data: {
          userID: number;
          R_value: number;
          level: string;
          createdAt: string;
          components?: { classifier?: { emotion?: string } };
        }[];
      }>(`${url}/levelDetection/all-users-latest-index`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const levelData = res.data.data;

      const updatedUsers = await Promise.all(
        levelData.map(async (ld) => {
          try {
            const last = await axios.get<{
              success: boolean;
              sessionID: string | null;
              answeredCount: number;
            }>(`${url}/phq9/last-session/${ld.userID}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const isComplete = last.data.answeredCount === 9;
            return {
              ...ld,
              level: isComplete ? ld.level : "Pending",
              lastSessionID: last.data.sessionID,
            };
          } catch (err) {
            console.error(
              "Error fetching PHQ9 session for user",
              ld.userID,
              err
            );
            return { ...ld, level: "Pending", lastSessionID: null };
          }
        })
      );

      // Merge with users
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const match = updatedUsers.find((u) => u.userID === user.userID);
          return match
            ? {
                ...user,
                level: match.level,
                R_value: match.R_value,
                components: match.components,
                createdAt: match.createdAt,
                lastSessionID: match.lastSessionID,
              }
            : user;
        })
      );
    } catch (error: any) {
      console.error("Error fetching levels:", error.message);
    }
  };

  const totalPatients = users.length;
  const severePatients = users.filter(
    (u) => u.level?.toLowerCase() === "severe"
  ).length;
  const moderatePatients = users.filter(
    (u) => u.level?.toLowerCase() === "moderate"
  ).length;
  const minimalPatients = users.filter(
    (u) => u.level?.toLowerCase() === "minimal"
  ).length;

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-purple-500/20 p-2 text-purple-600 dark:text-purple-400">
              <Users size={26} />
            </div>
            <p className="card-title">Total Patients</p>
          </div>
          <div className="card-body">
            <p className="text-3xl font-bold">{totalPatients}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-red-500/20 p-2 text-red-600 dark:text-red-400">
              <HeartPulse size={26} />
            </div>
            <p className="card-title">Severe Cases</p>
          </div>
          <div className="card-body">
            <p className="text-3xl font-bold">{severePatients}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-yellow-500/20 p-2 text-yellow-600 dark:text-yellow-400">
              <Activity size={26} />
            </div>
            <p className="card-title">Moderate Cases</p>
          </div>
          <div className="card-body">
            <p className="text-3xl font-bold">{moderatePatients}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-green-500/20 p-2 text-green-600 dark:text-green-400">
              <TrendingUp size={26} />
            </div>
            <p className="card-title">Minimal Cases</p>
          </div>
          <div className="card-body">
            <p className="text-3xl font-bold">{minimalPatients}</p>
          </div>
        </div>
      </div>

      {/* Recent Patient Activity */}
      <div className="card">
        <div className="card-header">
          <p className="card-title">Recent Assessments</p>
        </div>
        <div className="card-body h-[300px] overflow-auto p-0">
          {users.slice(0, 5).map((user, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b px-4 py-2"
            >
              <div>
                <p className="font-medium">{user.nickname}</p>
                <p className="text-sm text-slate-500">
                  Assessed:{" "}
                  {new Date(user.createdAt || "").toLocaleDateString()}
                </p>
              </div>
              <Tag color={levelColor(user.level)}>{user.level || "N/A"}</Tag>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="card col-span-1 md:col-span-2 lg:col-span-4">
          <div className="card-header">
            <p className="card-title">Overview</p>
          </div>
        </div>
        <div className="card col-span-1 md:col-span-2 lg:col-span-3">
          <div className="card-header">
            <p className="card-title">Recent Sales</p>
          </div>
          <div className="card-body h-[300px] overflow-auto p-0">
            {recentSalesData.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-x-4 py-2 pr-2"
              >
                <div className="flex items-center gap-x-4">
                  <img
                    alt={sale.name}
                    className="size-10 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-y-2">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {sale.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {sale.email}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  ${sale.total}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <p className="card-title">Top Orders</p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">#</th>
                  <th className="table-head">UserID</th>
                  <th className="table-head">Nickname</th>
                  <th className="table-head">Emotion</th>
                  <th className="table-head">Actions</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{user.userID}</td>
                    <td className="table-cell">
                      <div className="flex flex-col">
                        <p className="font-medium text-slate-900 dark:text-slate-50">
                          {user.nickname}
                        </p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-col">
                        <p className="font-medium text-slate-900 dark:text-slate-50">
                          {user.components?.classifier?.emotion}
                        </p>
                      </div>
                    </td>
                    <td className="table-cell text-white">
                      <div className="flex flex-col text-white">
                        <Typography.Text strong className="text-white">
                          Composite Index (R)
                        </Typography.Text>
                        <Progress
                          percent={Math.round(Number(user.R_value || 0) * 100)}
                          status="active"
                          strokeColor={
                            levelColor(user.level) === "gold"
                              ? "#faad14"
                              : levelColor(user.level) === "red"
                              ? "#ff4d4f"
                              : "#52c41a"
                          }
                          trailColor="rgba(255, 255, 255, 0.2)"
                          showInfo
                        />
                      </div>
                    </td>

                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <Tag color={levelColor(user.level)}>{user.level}</Tag>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
