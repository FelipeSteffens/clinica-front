import React from 'react'
import PatientsCounter from '../../components/counters/PatientsCounter/Index'

const Dashboard = () => {
    return (
        <div>
            <h1 className='text-xl font-bold text-cyan-800 mb-6'>Dashboard</h1>
            <div className='grid grid-cols-1sm:grid-cols-3 gap-6'>
                <PatientsCounter />
                <h2>Componente contador de consultas</h2>
                <h2>Componente contador de exames</h2>

            </div>

            {/* Lista de pacientes */}
            <h2>Lista de pacientes</h2>
        </div>
    )
}

export default Dashboard