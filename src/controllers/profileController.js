import { initChatOverlay } from "../shared/components/chatOverlay.js"
import { API_BASE } from "../shared/constants/api.js"
import { escapeHtml } from "../shared/utils/dom.js"
import {
  COLOR_SCHEME_OPTIONS,
  DISPLAY_MODE_OPTIONS,
  formatColorScheme,
  formatDisplayMode,
  formatDaltonismType
} from "../shared/constants/daltonism.js"
import { PRESET_PROFILE_AVATARS } from "../shared/constants/profileAvatars.js"
import { applyDaltonismTheme } from "../shared/utils/theme.js"
import {
  getUser,
  logout,
  setColorScheme,
  setDisplayMode,
  setProfileImage,
  setUsername
} from "../models/userModel.js"

export async function initProfile() {
  const container = document.getElementById("userInfo")
  const goCamera = document.getElementById("goCamera")
  const goQuiz = document.getElementById("goQuiz")
  const goAchievements = document.getElementById("goAchievements")
  const logoutBtn = document.getElementById("logoutBtn")
  const settingsBtn = document.getElementById("settingsBtn")
  const settingsModal = document.getElementById("settingsModal")
  const closeSettingsBtn = document.getElementById("closeSettingsBtn")
  const changePasswordBtn = document.getElementById("changePasswordBtn")
  const changeUsernameBtn = document.getElementById("changeUsernameBtn")
  const profileImageSelect = document.getElementById("profileImageSelect")
  const saveProfileImageBtn = document.getElementById("saveProfileImageBtn")
  const colorSchemeSelect = document.getElementById("colorSchemeSelect")
  const saveColorSchemeBtn = document.getElementById("saveColorSchemeBtn")
  const displayModeSelect = document.getElementById("displayModeSelect")
  const saveDisplayModeBtn = document.getElementById("saveDisplayModeBtn")

  if (!container) return

  const user = await getUser()

  if (!user) {
    window.location.href = "./auth/login.html"
    return
  }

  applyDaltonismTheme(user)

  function getInitials(username) {
    return (username || "U").trim().slice(0, 1).toUpperCase()
  }

  function normalizeAvatarPath(profileImage) {
    if (!profileImage) return ""
    if (profileImage.startsWith("/avatars/")) {
      return `/public${profileImage}`
    }
    return profileImage
  }

  function renderAvatarPicker(profileUser) {
    const preview = document.getElementById("profileImagePreview")
    if (!preview) return
    const normalizedProfileImage = normalizeAvatarPath(profileUser?.profileImage)

    const presetAvatar = PRESET_PROFILE_AVATARS.find(
      (avatar) => avatar.value === normalizedProfileImage
    )

    preview.innerHTML = presetAvatar
      ? `<img src="${escapeHtml(presetAvatar.value)}" alt="${escapeHtml(
          presetAvatar.label
        )} avatar">`
      : escapeHtml(getInitials(profileUser?.username))
  }

  function renderUserInfo(profileUser) {
    const visionType = formatDaltonismType(profileUser?.daltonismType)
    const colorSchemeLabel = formatColorScheme(profileUser?.colorScheme || "auto")
    const displayModeLabel = formatDisplayMode(profileUser?.displayMode || "light")
    const normalizedProfileImage = normalizeAvatarPath(profileUser?.profileImage)
    const avatarContent = normalizedProfileImage
      ? `<img src="${escapeHtml(normalizedProfileImage)}" alt="Profile picture">`
      : escapeHtml(getInitials(profileUser?.username))

    container.innerHTML = `
      <div class="profile-card">
        <div class="profile-avatar">${avatarContent}</div>
        <p><strong>Username:</strong> ${escapeHtml(profileUser.username || "Guest")}</p>
        <p><strong>Role:</strong> ${escapeHtml(profileUser.role || "User")}</p>
        <p><strong>Vision type:</strong> ${escapeHtml(visionType)}</p>
        <p><strong>Color scheme:</strong> ${escapeHtml(colorSchemeLabel)}</p>
        <p><strong>Display mode:</strong> ${escapeHtml(displayModeLabel)}</p>
        <p><strong>Level:</strong> ${escapeHtml(profileUser.level || 1)}</p>
        <p><strong>XP:</strong> ${escapeHtml(profileUser.xp || 0)}</p>
      </div>
    `

    if (colorSchemeSelect) {
      colorSchemeSelect.value = profileUser?.colorScheme || "auto"
    }

    if (displayModeSelect) {
      displayModeSelect.value = profileUser?.displayMode || "light"
    }

    if (profileImageSelect) {
      const selectedAvatar = PRESET_PROFILE_AVATARS.some(
        (avatar) => avatar.value === normalizedProfileImage
      )
        ? normalizedProfileImage
        : ""
      profileImageSelect.value = selectedAvatar
    }

    renderAvatarPicker(profileUser)
  }

  renderUserInfo(user)

  const params = new URLSearchParams(window.location.search)
  if (params.get("refresh") === "true") {
    const refreshed = await getUser()
    if (refreshed) {
      Object.assign(user, refreshed)
      applyDaltonismTheme(refreshed)
      renderUserInfo(refreshed)
    }
    window.history.replaceState({}, "", "./profile.html")
  }

  if (goCamera) {
    goCamera.addEventListener("click", () => {
      window.location.href = "./camera.html"
    })
  }

  if (goQuiz) {
    goQuiz.addEventListener("click", () => {
      window.location.href = "./quiz.html"
    })
  }

  if (goAchievements) {
    goAchievements.addEventListener("click", () => {
      window.location.href = "./achievements.html"
    })
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout()
      window.location.href = "./auth/login.html"
    })
  }

  if (settingsBtn && settingsModal && closeSettingsBtn) {
    settingsBtn.addEventListener("click", () => {
      renderUserInfo(user)
      settingsModal.classList.remove("hidden")
    })

    closeSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.add("hidden")
    })

    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.add("hidden")
      }
    })

    if (colorSchemeSelect) {
      colorSchemeSelect.innerHTML = COLOR_SCHEME_OPTIONS.map(
        (option) =>
          `<option value="${option.value}">${escapeHtml(option.label)}</option>`
      ).join("")
      colorSchemeSelect.value = user.colorScheme || "auto"
    }

    if (displayModeSelect) {
      displayModeSelect.innerHTML = DISPLAY_MODE_OPTIONS.map(
        (option) =>
          `<option value="${option.value}">${escapeHtml(option.label)}</option>`
      ).join("")
      displayModeSelect.value = user.displayMode || "light"
    }

    if (saveColorSchemeBtn && colorSchemeSelect) {
      saveColorSchemeBtn.addEventListener("click", async () => {
        const updated = await setColorScheme(colorSchemeSelect.value)
        if (!updated) {
          alert("Unable to change scheme")
          return
        }

        Object.assign(user, updated)
        applyDaltonismTheme(updated)
        renderUserInfo(updated)
      })
    }

    if (saveDisplayModeBtn && displayModeSelect) {
      saveDisplayModeBtn.addEventListener("click", async () => {
        const updated = await setDisplayMode(displayModeSelect.value)
        if (!updated) {
          alert("Unable to change display mode")
          return
        }

        Object.assign(user, updated)
        applyDaltonismTheme(updated)
        renderUserInfo(updated)
      })
    }

    if (profileImageSelect) {
      profileImageSelect.innerHTML = [
        `<option value="">No picture</option>`,
        ...PRESET_PROFILE_AVATARS.map(
          (avatar) =>
            `<option value="${avatar.value}">${escapeHtml(avatar.label)}</option>`
        )
      ].join("")
      renderUserInfo(user)
      profileImageSelect.addEventListener("change", () => {
        renderAvatarPicker({
          username: user.username,
          profileImage: profileImageSelect.value
        })
      })
    }

    if (changePasswordBtn) {
      changePasswordBtn.addEventListener("click", async () => {
        const currentPassword = prompt("Enter current password:")
        if (!currentPassword) return

        if (currentPassword !== user.password) {
          alert("Current password is incorrect")
          return
        }

        const newPassword = prompt("Enter new password:")
        if (!newPassword || newPassword.length < 4) {
          alert("Password must be at least 4 characters")
          return
        }

        try {
          const res = await fetch(`${API_BASE}/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword })
          })

          if (!res.ok) {
            alert("Unable to change password. Please try again.")
            return
          }

          user.password = newPassword
          alert("Password changed successfully")
          settingsModal.classList.add("hidden")
        } catch (err) {
          alert("Error changing password: " + err.message)
        }
      })
    }

    if (changeUsernameBtn) {
      changeUsernameBtn.addEventListener("click", async () => {
        const newUsername = prompt("Enter new username:", user.username || "")
        if (newUsername === null) return

        const result = await setUsername(newUsername)
        if (!result.success) {
          alert(result.message)
          return
        }

        Object.assign(user, result.user)
        renderUserInfo(result.user)
        alert("Username changed successfully")
        settingsModal.classList.add("hidden")
      })
    }

    if (profileImageSelect && saveProfileImageBtn) {
      saveProfileImageBtn.addEventListener("click", async () => {
        const updated = await setProfileImage(profileImageSelect.value)
        if (!updated) {
          alert("Unable to change profile picture")
          return
        }

        Object.assign(user, updated)
        renderUserInfo(updated)
        settingsModal.classList.add("hidden")
      })
    }
  }

  initChatOverlay()
}
