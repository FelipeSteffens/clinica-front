import { useEffect, useState } from "react"
import { Outlet } from "react-router"
import { FaMoon, FaSun } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import SideMenu from "../components/SideMenu"

const DashboardLayout = () => {
    const { user, logout } = useAuth()
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark")

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light")
    }, [darkMode])

    return (
        <div className={"flex min-h-screen transition-colors " + (darkMode ? "dark-mode bg-gray-900" : "bg-gray-100")}>
            {/* barra lateral - menu */}

            <SideMenu darkMode={darkMode} />

            {/* Conteudo principal */}
            <main className="flex-1 flex flex-col">
                <header className={"flex justify-between items-center p-4 shadow transition-colors " + (darkMode ? "bg-gray-800" : "bg-white")}>
                    <h1 className={"text-xl font-bold " + (darkMode ? "text-cyan-300" : "text-cyan-800")}>Painel do Sistema</h1>
                    {
                        user && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setDarkMode((prev) => !prev)}
                                    className={"flex items-center gap-2 px-3 py-1 rounded transition " + (darkMode ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100")}
                                >
                                    {darkMode ? <FaSun /> : <FaMoon />}
                                    {darkMode ? "Claro" : "Escuro"}
                                </button>
                                <span className={darkMode ? "text-gray-200" : "text-gray-700"}>Bem Vindo, {user.email}</span>
                                <button
                                    onClick={logout}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Sair

                                </button>

                            </div>
                        )
                    }
                </header>

                {/* Paginas internas do dashboard */}
                <section className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout
