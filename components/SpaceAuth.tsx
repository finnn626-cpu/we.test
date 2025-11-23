import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { StorageService } from '../services/storageService';
import { User } from '../types';

interface SpaceAuthProps {
  onJoin: (spaceId: string, user: User) => void;
}

export const SpaceAuth: React.FC<SpaceAuthProps> = ({ onJoin }) => {
  const [mode, setMode] = useState<'join' | 'create'>('create');
  const [spaceName, setSpaceName] = useState('');
  const [spaceId, setSpaceId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!spaceName || !password || !nickname) {
      setError("请填写所有信息");
      return;
    }
    const space = StorageService.createSpace(spaceName, password);
    handleSuccess(space.id);
  };

  const handleJoin = () => {
    if (!spaceId || !password || !nickname) {
      setError("请填写所有信息");
      return;
    }
    if (StorageService.validateSpace(spaceId, password)) {
      handleSuccess(spaceId);
    } else {
      setError("空间ID或密码错误");
    }
  };

  const handleSuccess = (sid: string) => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      nickname,
      avatar: avatar || undefined
    };
    onJoin(sid, user);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 z-10 border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            LOVE ROOM
          </h1>
          <p className="text-gray-500">只属于你们的私密空间</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'create' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
            onClick={() => { setMode('create'); setError(''); }}
          >
            创建新空间
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'join' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
            onClick={() => { setMode('join'); setError(''); }}
          >
            加入空间
          </button>
        </div>

        <div className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-white border-4 border-pink-100 shadow-md overflow-hidden flex items-center justify-center cursor-pointer hover:border-pink-300 transition-colors relative group"
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-300 group-hover:text-pink-400 transition-colors">
                  <i className="fas fa-camera text-2xl mb-1"></i>
                  <span className="text-xs">上传头像</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <i className="fas fa-pen text-white"></i>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <Input 
            placeholder="你的昵称" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)}
            className="text-center"
          />

          {mode === 'create' ? (
            <>
              <Input 
                placeholder="给空间起个名 (如: 温馨小窝)" 
                value={spaceName} 
                onChange={(e) => setSpaceName(e.target.value)} 
              />
              <Input 
                type="password" 
                placeholder="设置访问密码" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </>
          ) : (
            <>
              <Input 
                placeholder="输入空间 ID" 
                value={spaceId} 
                onChange={(e) => setSpaceId(e.target.value)} 
              />
              <Input 
                type="password" 
                placeholder="输入密码" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <Button 
            className="w-full py-4 text-lg mt-4" 
            onClick={mode === 'create' ? handleCreate : handleJoin}
          >
            {mode === 'create' ? '立即创建' : '进入空间'}
          </Button>
        </div>
      </div>
    </div>
  );
};
