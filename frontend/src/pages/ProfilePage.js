import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth.api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  // State for profile update
  const [profileValues, setProfileValues] = useState({ name: user?.name || "" });
  const [profileLoading, setProfileLoading] = useState(false);

  // State for password update
  const [pwValues, setPwValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  const initials =
    user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  // Save profile changes
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileValues.name.trim() || profileValues.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    setProfileLoading(true);
    try {
      const { data } = await authApi.updateProfile({
        name: profileValues.name.trim(),
      });
      updateUser(data.data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  // Save password changes
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwValues.currentPassword) errs.currentPassword = "Required";
    if (!pwValues.newPassword || pwValues.newPassword.length < 6)
      errs.newPassword = "At least 6 characters";
    if (pwValues.newPassword !== pwValues.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (Object.keys(errs).length) {
      setPwErrors(errs);
      return;
    }

    setPwLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: pwValues.currentPassword,
        newPassword: pwValues.newPassword,
      });
      toast.success("Password changed!");
      setPwValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  // Section wrapper
  const Section = ({ title, children }) => (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 640 }}>
      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.5px",
          marginBottom: 28,
        }}
      >
        Profile Settings
      </h1>

      {/* Account Info */}
      <Section title="Account Information">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
            padding: 16,
            background: "var(--bg)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "var(--accent-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--accent)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)" }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {user?.email}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 2,
                textTransform: "capitalize",
              }}
            >
              {user?.role} · Member since{" "}
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
        <form
          onSubmit={handleProfileSave}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Input
            label="Full name"
            value={profileValues.name}
            onChange={(e) => setProfileValues({ name: e.target.value })}
            placeholder="Your name"
          />
          <Input
            label="Email address"
            value={user?.email}
            disabled
            style={{ opacity: 0.6 }}
            hint="Email cannot be changed"
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" loading={profileLoading}>
              Save changes
            </Button>
          </div>
        </form>
      </Section>

      {/* Change Password */}
      <Section title="Change Password">
        <form
          onSubmit={handlePasswordSave}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Input
            label="Current password"
            type="password"
            value={pwValues.currentPassword}
            onChange={(e) => {
              setPwValues((prev) => ({ ...prev, currentPassword: e.target.value }));
              setPwErrors((prev) => ({ ...prev, currentPassword: "" }));
            }}
            error={pwErrors.currentPassword}
            placeholder="••••••••"
          />
          <Input
            label="New password"
            type="password"
            value={pwValues.newPassword}
            onChange={(e) => {
              setPwValues((prev) => ({ ...prev, newPassword: e.target.value }));
              setPwErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            error={pwErrors.newPassword}
            placeholder="••••••••"
            hint="At least 6 characters"
          />
          <Input
            label="Confirm new password"
            type="password"
            value={pwValues.confirmPassword}
            onChange={(e) => {
              setPwValues((prev) => ({ ...prev, confirmPassword: e.target.value }));
              setPwErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            error={pwErrors.confirmPassword}
            placeholder="••••••••"
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" loading={pwLoading}>
              Update password
            </Button>
          </div>
        </form>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone">
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 16,
          }}
        >
          These actions are permanent and cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() =>
            toast("Account deletion not available in demo", { icon: "ℹ️" })
          }
        >
          Delete Account
        </Button>
      </Section>
    </div>
  );
}
