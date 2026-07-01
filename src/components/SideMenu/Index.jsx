import { useNavigate, NavLink } from 'react-router'
import {
    MdDashboard,
    MdExitToApp,
    MdMenu,
    MdClose
} from 'react-icons/md'

import {
    FaUserPlus,
    FaListAlt,
    FaCalendarCheck
} from 'react-icons/fa'

import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

const SideMenu = ({ darkMode }) => {
    const navigate = useNavigate()

    const { logout } = useAuth()

    // controle do menu sanfonado
    const [isCollapsed, setIsCollapsed] = useState(false)

    // funcao do logout
    const handleLogout = () => {
        logout()
        navigate('/')
    }

    //funcao toggle menu

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed)
    }

    const menuClass = ({ isActive }) =>
        'flex gap-2 hover:text-cyan-300 ' + (isActive ? 'text-cyan-300' : 'text-white')

    return (
        <aside
            className={'h-screen text-white flex flex-col justify-between transition-all duration-300 ' +
                (darkMode ? 'bg-gray-950' : 'bg-cyan-800') + ' ' +
                (isCollapsed ? 'w-20' : 'w-64')}
        >
            {/* topo - botao toggle */}
            <div className={'p-4 flex items-center justify-between border-b ' + (darkMode ? 'border-gray-800' : 'border-cyan-700')}>
                {
                    !isCollapsed && (
                        <h1 className='text-lg font-bold'>Clinica +</h1>
                    )
                }
                <button
                    onClick={toggleMenu}
                    className='text-white hover:text-cyan-300 focus:outline-none'
                >
                    {isCollapsed ? <MdMenu size={24} /> : <MdClose size={24} />}
                </button>
            </div>

            {/* Menu */}
            <nav className='flex-1 p-4 space-y-4 overflow-y-auto'>
                <ul className='space-y-3'>
                    <li>
                        <NavLink to="/dashboard" className={menuClass}>
                            <MdDashboard size={20} />
                            {!isCollapsed && <span>Inicio</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/prontuarios" className={menuClass}>
                            <FaCalendarCheck size={20} />
                            {!isCollapsed && <span>Prontuarios</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/pacientes" className={menuClass}>
                            <FaUserPlus size={20} />
                            {!isCollapsed && <span>Registrar Paciente</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/consultas" className={menuClass}>
                            <MdMenu size={20} />
                            {!isCollapsed && <span>Consultas</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/exames" className={menuClass}>
                            <FaListAlt size={20} />
                            {!isCollapsed && <span>Exames</span>}
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* botao sair */}
            <div className={'p-4 border-t ' + (darkMode ? 'border-gray-800' : 'border-cyan-700')}>
                <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 text-red-300 hover:text-red-500 w-full cursor-pointer'
                >
                    <MdExitToApp size={20} />
                    {!isCollapsed && <span>Sair</span>}

                </button>
            </div>

        </aside >
    )
}

export default SideMenu
