import { useMemo, useCallback } from "react";

export const useUser = () => {
  const token = useMemo(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  }, []);

  const decodedPayload = useMemo(() => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsed = JSON.parse(jsonPayload);
      return parsed;
    } catch (error) {
      console.error("❌ Failed to decode JWT:", error);
      return null;
    }
  }, [token]);

  const employeeId = decodedPayload?.employeeId || null;

  const roles = useMemo(() => {
    try {
      const rawRoles = localStorage.getItem("role");
      const parsedRoles = rawRoles ? JSON.parse(rawRoles) : [];
      return parsedRoles.map((r) => r.toLowerCase());
    } catch {
      return [];
    }
  }, []);

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const hasRole = useCallback(
    (roleList) => {
      const list = Array.isArray(roleList) ? roleList : [roleList];
      return list.some((r) => roles.includes(r.toLowerCase()));
    },
    [roles]
  );

  return { user, token, roles, hasRole, employeeId };
};
