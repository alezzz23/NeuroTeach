import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { userService } from '../services/api';
import './Profile.css';

function Profile() {
    const { getToken } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Profile form
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [preferredLang, setPreferredLang] = useState('es');
    const [preferredTheme, setPreferredTheme] = useState('system');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwSaving, setPwSaving] = useState(false);
    const [pwSuccess, setPwSuccess] = useState('');
    const [pwError, setPwError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getMe();
            setProfile(data);
            setName(data.name || '');
            setBio(data.bio || '');
            setPreferredLang(data.preferredLang || 'es');
            setPreferredTheme(data.preferredTheme || 'system');
        } catch (err) {
            setErrorMsg('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const updated = await userService.updateProfile({
                name,
                bio,
                preferredLang,
                preferredTheme,
            });
            setProfile(updated);
            setSuccessMsg('Perfil actualizado correctamente');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg('Error al guardar el perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPwError('Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 6) {
            setPwError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        setPwSaving(true);
        setPwSuccess('');
        setPwError('');
        try {
            const result = await userService.changePassword(currentPassword, newPassword);
            if (result.error) {
                setPwError(result.error);
            } else {
                setPwSuccess('Contraseña actualizada correctamente');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPwSuccess(''), 3000);
            }
        } catch (err) {
            setPwError('Error al cambiar la contraseña');
        } finally {
            setPwSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-container" style={{ textAlign: 'center', paddingTop: 80, color: 'rgba(255,255,255,0.4)' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: 24 }}></i>
                    <p>Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* ====== Header Card ====== */}
                <div className="profile-header-card">
                    <div className="profile-avatar-large">
                        {profile?.avatarUrl ? (
                            <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <i className="fas fa-user"></i>
                        )}
                    </div>
                    <div className="profile-header-info">
                        <h2>{profile?.name || 'Usuario'}</h2>
                        <p>{profile?.email}</p>
                        <div className="profile-stats-row">
                            <div className="profile-stat">
                                <i className="fas fa-trophy text-warning"></i>
                                Nivel <span className="stat-val">{profile?.level || 1}</span>
                            </div>
                            <div className="profile-stat">
                                <i className="fas fa-star text-warning"></i>
                                <span className="stat-val">{profile?.totalPoints || 0}</span> pts
                            </div>
                            <div className="profile-stat">
                                <i className="fas fa-fire text-danger"></i>
                                Racha <span className="stat-val">{profile?.currentStreak || 0}</span>
                            </div>
                        </div>
                        {profile?.createdAt && (
                            <div className="profile-member-since">
                                <i className="fas fa-calendar-alt"></i>
                                Miembro desde {new Date(profile.createdAt).toLocaleDateString('es', { year: 'numeric', month: 'long' })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ====== Profile Info Form ====== */}
                <div className="profile-card">
                    <h3 className="profile-card-title">
                        <i className="fas fa-user-edit"></i>
                        Información personal
                    </h3>
                    <form onSubmit={handleSaveProfile}>
                        <div className="profile-form-group">
                            <label htmlFor="profileName">Nombre</label>
                            <input
                                id="profileName"
                                type="text"
                                className="profile-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre"
                                required
                            />
                        </div>
                        <div className="profile-form-group">
                            <label htmlFor="profileBio">Bio</label>
                            <textarea
                                id="profileBio"
                                className="profile-input profile-textarea"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Cuéntanos sobre ti..."
                            />
                        </div>
                        <div className="profile-row">
                            <div className="profile-form-group">
                                <label htmlFor="profileLang">Idioma preferido</label>
                                <select
                                    id="profileLang"
                                    className="profile-select"
                                    value={preferredLang}
                                    onChange={(e) => setPreferredLang(e.target.value)}
                                >
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div className="profile-form-group">
                                <label htmlFor="profileTheme">Tema</label>
                                <select
                                    id="profileTheme"
                                    className="profile-select"
                                    value={preferredTheme}
                                    onChange={(e) => setPreferredTheme(e.target.value)}
                                >
                                    <option value="system">Sistema</option>
                                    <option value="dark">Oscuro</option>
                                    <option value="light">Claro</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="profile-save-btn" disabled={saving}>
                            <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        {successMsg && (
                            <div className="profile-success-msg">
                                <i className="fas fa-check-circle"></i> {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="profile-error-msg">
                                <i className="fas fa-exclamation-circle"></i> {errorMsg}
                            </div>
                        )}
                    </form>
                </div>

                {/* ====== Password Change ====== */}
                <div className="profile-card">
                    <h3 className="profile-card-title">
                        <i className="fas fa-lock"></i>
                        Cambiar contraseña
                    </h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="profile-form-group">
                            <label htmlFor="currentPw">Contraseña actual</label>
                            <input
                                id="currentPw"
                                type="password"
                                className="profile-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="profile-row">
                            <div className="profile-form-group">
                                <label htmlFor="newPw">Nueva contraseña</label>
                                <input
                                    id="newPw"
                                    type="password"
                                    className="profile-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="profile-form-group">
                                <label htmlFor="confirmPw">Confirmar contraseña</label>
                                <input
                                    id="confirmPw"
                                    type="password"
                                    className="profile-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite la contraseña"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="profile-save-btn" disabled={pwSaving}>
                            <i className={`fas ${pwSaving ? 'fa-spinner fa-spin' : 'fa-key'}`}></i>
                            {pwSaving ? 'Actualizando...' : 'Cambiar contraseña'}
                        </button>
                        {pwSuccess && (
                            <div className="profile-success-msg">
                                <i className="fas fa-check-circle"></i> {pwSuccess}
                            </div>
                        )}
                        {pwError && (
                            <div className="profile-error-msg">
                                <i className="fas fa-exclamation-circle"></i> {pwError}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
