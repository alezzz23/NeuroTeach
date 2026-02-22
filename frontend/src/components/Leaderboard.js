import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { userService } from '../services/api';
import './Leaderboard.css';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getUserId } = useAuth();
    const currentUserId = getUserId();

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await userService.getLeaderboard();
            setLeaderboard(Array.isArray(data) ? data : []);
        } catch {
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="leaderboard-page">
                <div className="leaderboard-container" style={{ textAlign: 'center', paddingTop: 80, color: 'rgba(255,255,255,0.4)' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: 24 }}></i>
                    <p>Cargando clasificación...</p>
                </div>
            </div>
        );
    }

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);
    const podiumOrder = [top3[1], top3[0], top3[2]]; // silver, gold, bronze
    const podiumClasses = ['silver', 'gold', 'bronze'];

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-container">
                <h2 className="leaderboard-title">
                    <i className="fas fa-trophy"></i>
                    Tabla de Clasificación
                </h2>

                {/* Podium for top 3 */}
                {top3.length >= 3 && (
                    <div className="leaderboard-podium">
                        {podiumOrder.map((user, idx) => {
                            if (!user) return null;
                            const rank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                            return (
                                <div key={user.id} className={`podium-item ${podiumClasses[idx]}`}>
                                    <div className="podium-rank">{rank}</div>
                                    <div className="podium-avatar">
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </div>
                                    <div className="podium-name">{user.name}</div>
                                    <div className="podium-points">{user.totalPoints?.toLocaleString()} pts</div>
                                    <div className="podium-level">Nivel {user.level}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Table for the rest (or all if less than 3) */}
                <div className="leaderboard-table">
                    {(top3.length < 3 ? leaderboard : rest).map((user, idx) => {
                        const rank = top3.length < 3 ? idx + 1 : idx + 4;
                        const isMe = user.id === currentUserId;
                        return (
                            <div key={user.id} className={`leaderboard-row ${isMe ? 'is-me' : ''}`}>
                                <div className="lb-rank">{rank}</div>
                                <div className="lb-avatar">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(user.name)
                                    )}
                                </div>
                                <div className="lb-name">
                                    {user.name} {isMe && <span style={{ fontSize: 11, color: '#a5b4fc' }}>(tú)</span>}
                                </div>
                                <div className="lb-points">{user.totalPoints?.toLocaleString()} pts</div>
                                <div className="lb-streak">
                                    <i className="fas fa-fire"></i> {user.currentStreak || 0}
                                </div>
                                <div className="lb-level">Nv. {user.level}</div>
                            </div>
                        );
                    })}

                    {leaderboard.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.4)' }}>
                            <i className="fas fa-users" style={{ fontSize: 24, marginBottom: 8, display: 'block' }}></i>
                            Aún no hay usuarios en la clasificación
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
