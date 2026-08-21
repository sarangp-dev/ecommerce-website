import { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

interface AuthProps {
    onSwitch: () => void;
    role: 'user' | 'admin';
    activeField: number;
    setActiveField: (index: number) => void;
}



function Registration({ onSwitch, role, activeField, setActiveField }: AuthProps) {

    const [Formdata, setFormdata] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [profilePhoto, setprofilePhoto] = useState<File | null>(null);

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setprofilePhoto(e.target.files[0]);
        }
    };
    const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle registration logic here
        console.log('Registration data:', Formdata);
        try {
            const formData = new FormData();
            formData.append('username', Formdata.username);
            formData.append('email', Formdata.email);
            formData.append('password', Formdata.password);
            formData.append('confirmPassword', Formdata.confirmPassword);
            if (profilePhoto) {
                formData.append('profilePhoto', profilePhoto);
            } console.log("Checking file before send:", profilePhoto);
            const response = await axios.post(`${API_URL}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                console.log('Registration successful:', response.data);
                onSwitch();
                // Optionally, you can redirect the user or show a success message here
            }
        } catch (err) {
            console.error('Error during registration:', err);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center p-8 bg-transparent relative">
            <div className="absolute left-[23px] top-20 bottom-16 w-8 pointer-events-none z-0">
                <svg className="h-full overflow-visible" height="100%" width="2">
                    <line stroke="#d0c5af" strokeDasharray="6,6" strokeWidth="2" x1="1" x2="1" y1="0" y2="100%" />
                    <line
                        className="transition-all duration-500 ease-in-out"
                        stroke="#2D5A27"
                        strokeWidth="4"
                        x1="1"
                        x2="1"
                        y1="0"
                        y2={`${(activeField / 6) * 100}%`}
                    />
                </svg>
            </div>

            <div className="flex items-center gap-2 mb-4 justify-center">
                <span className="material-symbols-outlined text-[#735c00] text-3xl">explore</span>
                <h2 className="text-2xl font-extrabold text-[#1f1b13] tracking-tight font-['Bricolage_Grotesque']">Yuthi</h2>
            </div>
            <p className="text-xs text-[#4d4635] text-center mb-6 font-['Manrope']">Begin Your Expedition • Register ({role.toUpperCase()})</p>

            <form className="space-y-6 relative z-10" onSubmit={(e) => handleRegistration(e)}>
                <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 1 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">FULL NAME (IDENTIFIER)</label>
                        <input
                            type="text"
                            onFocus={() => setActiveField(1)}
                            className="w-full bg-transparent border-b-2 border-[#d0c5af] focus:border-[#735c00] text-[#1f1b13] py-1 outline-none text-sm font-['Manrope']"
                            placeholder="Full Name"
                            value={Formdata.username}
                            onChange={(e) => setFormdata({ ...Formdata, username: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 2 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">mail</span>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">COORDINATES (EMAIL)</label>
                        <input
                            type="email"
                            onFocus={() => setActiveField(2)}
                            className="w-full bg-transparent border-b-2 border-[#d0c5af] focus:border-[#735c00] text-[#1f1b13] py-1 outline-none text-sm font-['Manrope']"
                            placeholder="explorer@yuthi.com"
                            value={Formdata.email}
                            onChange={(e) => setFormdata({ ...Formdata, email: e.target.value })}
                            required
                        />
                    </div>
                </div>
                {/* <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 3 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">PROFILE PHOTO</label>
                        <input
                            type="file"
                            onFocus={() => setActiveField(3)}
                            className="w-full bg-transparent border-b-2 border-[#d0c5af] focus:border-[#735c00] text-[#1f1b13] py-1 outline-none text-sm font-['Manrope']"
                            placeholder=""
                            accept='image/*'
                            onChange={(e) => handleProfilePhotoChange(e)}
                            required
                        />

                        <span className="truncate">
                            {profilePhoto
                                ? profilePhoto.name
                                : "Choose profile photo"}
                        </span>

                    </div>
                </div> */}
                {/* <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 3 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </div>


                    <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">PROFILE PHOTO</label>

                    <input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProfilePhotoChange(e)}
                        className="hidden"
                        required
                    />
                    <span className="truncate">
                        {profilePhoto
                            ? profilePhoto.name
                            : "Choose profile photo"}
                    </span>

                </div> */}
                <div className="flex items-center gap-4 group">

                    {/* Camera icon */}
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 3
                            ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md'
                            : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm">
                            photo_camera
                        </span>
                    </div>

                    {/* Profile photo field */}
                    <div className="flex-grow">

                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">
                            PROFILE PHOTO
                        </label>

                        {/* Hidden actual input */}
                        <input
                            id="profilePhoto"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                handleProfilePhotoChange(e);
                                setActiveField(3);
                            }}
                            onFocus={() => setActiveField(3)}
                            className="hidden"
                            required

                        />

                        {/* Custom file selector */}
                        <label
                            htmlFor="profilePhoto"
                            className="flex items-center gap-2 w-full border-b-2 border-[#d0c5af] py-1 cursor-pointer text-sm text-[#6b6250] hover:text-[#735c00] transition-colors"
                        >
                            <span className="truncate">
                                {profilePhoto
                                    ? profilePhoto.name
                                    : "Choose profile photo"}
                            </span>
                        </label>

                    </div>
                </div>


                <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 4 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">key</span>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">CIPHER (PASSWORD)</label>
                        <input
                            type="password"
                            onFocus={() => setActiveField(4)}
                            className="w-full bg-transparent border-b-2 border-[#d0c5af] focus:border-[#735c00] text-[#1f1b13] py-1 outline-none text-sm font-['Manrope']"
                            placeholder="••••••••"
                            value={Formdata.password}
                            onChange={(e) => setFormdata({ ...Formdata, password: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 5 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">CONFIRM CIPHER</label>
                        <input
                            type="password"
                            onFocus={() => setActiveField(5)}
                            className="w-full bg-transparent border-b-2 border-[#d0c5af] focus:border-[#735c00] text-[#1f1b13] py-1 outline-none text-sm font-['Manrope']"
                            placeholder="Confirm Password"
                            value={Formdata.confirmPassword}
                            onChange={(e) => setFormdata({ ...Formdata, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#735c00] hover:bg-[#554300] text-white rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 font-['Bricolage_Grotesque']"
                    onClick={() => handleRegistration}>
                    <span>Begin Expedition</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </form >

            <p className="mt-4 text-xs text-center text-[#4d4635] font-['Manrope']">
                Already charting a course?{' '}
                <button onClick={onSwitch} className="text-[#735c00] font-bold hover:underline">
                    Login
                </button>
            </p>
        </div >
    );
}

function Login({ onSwitch, role, activeField, setActiveField }: AuthProps) {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email: loginData.email,
                password: loginData.password
            },
                {
                    withCredentials: true,
                });
            if (response.status === 200 || response.status === 201) {
                console.log('Login successful:', response.data);
                // Handle successful login, e.g., redirect or show a success message
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center p-8 bg-transparent relative">
            <div className="absolute left-[23px] top-24 bottom-20 w-8 pointer-events-none z-0">
                <svg className="h-full overflow-visible" height="100%" width="2">
                    <line stroke="#d0c5af" strokeDasharray="6,6" strokeWidth="2" x1="1" x2="1" y1="0" y2="100%" />
                    <line
                        className="transition-all duration-500 ease-in-out"
                        stroke="#2D5A27"
                        strokeWidth="3"
                        x1="1"
                        x2="1"
                        y1="0"
                        y2={`${activeField === 2 ? 25 : activeField === 3 ? 75 : 0}%`}
                    />
                </svg>
            </div>

            <div className="flex items-center gap-2 mb-4 justify-center">
                <span className="material-symbols-outlined text-[#735c00] text-3xl">explore</span>
                <h2 className="text-2xl font-extrabold text-[#1f1b13] tracking-tight font-['Bricolage_Grotesque']">Yuthi</h2>
            </div>
            <p className="text-xs text-[#4d4635] text-center mb-6 font-['Manrope']">Welcome Back, Explorer ({role.toUpperCase()})</p>

            <form className="space-y-6 relative z-10" onSubmit={(e) => handleLogin(e)}>
                <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 2 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">mail</span>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">COORDINATES (EMAIL)</label>
                        <input
                            type="email"
                            onFocus={() => setActiveField(2)}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="w-full bg-transparent border-b-2 border-[#d0c5af] focus:border-[#735c00] text-[#1f1b13] py-1 outline-none text-sm font-['Manrope']"
                            placeholder="explorer@yuthi.com"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${activeField === 3 ? 'bg-[#d4af37] border-[#735c00] text-white shadow-md' : 'bg-[#eae1d4] border-[#d0c5af] text-[#4d4635]'}`}>
                        <span className="material-symbols-outlined text-sm">key</span>
                    </div>
                    <div className="flex-grow">
                        <label className="block text-[10px] font-bold tracking-wider text-[#4d4635] font-['Space_Grotesk']">CIPHER (PASSWORD)</label>
                        <input
                            type="password"
                            onFocus={() => setActiveField(3)}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full bg-transparent border-b-2 border-[#d0c5af] focus:border-[#735c00] text-[#1f1b13] py-1 outline-none text-sm font-['Manrope']"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#735c00] hover:bg-[#554300] text-white rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 font-['Bricolage_Grotesque']">
                    <span>Resume Expedition</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </form>

            <p className="mt-6 text-xs text-center text-[#4d4635] font-['Manrope']">
                New to the unknown?{' '}
                <button onClick={onSwitch} className="text-[#735c00] font-bold hover:underline">
                    Create account
                </button>
            </p>
        </div>
    );
}

export default function Authentication() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [activeField, setActiveField] = useState<number>(2);


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f0] text-[#1f1b13] font-['Manrope'] p-4 relative overflow-hidden">
            {/* Include Google Material Symbols */}
            <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Space+Grotesk:wght@500;600&family=Manrope:wght@400;500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            {/* Role Toggle Header */}{!isLogin && (
                < div className="w-full max-w-sm mb-6 z-10">
                    <div className="bg-[#efe7da] rounded-full p-1 flex relative shadow-inner">
                        <button
                            className={`relative z-10 flex-1 py-1.5 text-xs font-bold tracking-wider font-['Space_Grotesk'] transition-colors ${role === 'user' ? 'text-[#735c00]' : 'text-[#4d4635]'}`}
                            onClick={() => setRole('user')}
                        >
                            USER
                        </button>
                        <button
                            className={`relative z-10 flex-1 py-1.5 text-xs font-bold tracking-wider font-['Space_Grotesk'] transition-colors ${role === 'admin' ? 'text-[#735c00]' : 'text-[#4d4635]'}`}
                            onClick={() => setRole('admin')}
                        >
                            ADMIN
                        </button>
                        <div className={`absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-[#fff8f0] rounded-full shadow-sm transition-transform duration-300 ${role === 'admin' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                    </div>
                </div>)}

            {/* Glass Card Container styled with yuthi palette */}
            <div className="relative w-full max-w-md h-[580px] bg-[#f5eddf]/80 backdrop-blur-xl border border-[#d0c5af] rounded-3xl shadow-xl overflow-hidden z-10">
                {/* Login Container */}
                <div className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Login onSwitch={() => { setIsLogin(false); setActiveField(1); }} role={role} activeField={activeField} setActiveField={setActiveField} />
                </div>

                {/* Registration Container */}
                <div className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out ${isLogin ? 'translate-x-full' : 'translate-x-0'}`}>
                    <Registration onSwitch={() => { setIsLogin(true); setActiveField(2); }} role={role} activeField={activeField} setActiveField={setActiveField} />
                </div>
            </div>
        </div>
    );
}