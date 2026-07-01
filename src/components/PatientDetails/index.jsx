import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaFilePdf, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'

const emptyConsult = {
    reason: '',
    date: '',
    time: '',
    description: '',
    medication: '',
    dosagePrecautions: '',
}

const emptyExam = {
    name: '',
    date: '',
    time: '',
    type: '',
    laboratory: '',
    documentUrl: '',
    results: '',
}

const PatientDetails = () => {
    const { id } = useParams()
    const [patient, setPatient] = useState(null)
    const [consults, setConsults] = useState([])
    const [exams, setExams] = useState([])
    const [sortOrder, setSortOrder] = useState('desc')
    const [editing, setEditing] = useState(null)
    const [editData, setEditData] = useState(emptyConsult)
    const [editingExam, setEditingExam] = useState(null)
    const [editExamData, setEditExamData] = useState(emptyExam)

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientRes = await axios.get('http://localhost:3000/patients/' + id)
                const consultsRes = await axios.get('http://localhost:3000/consults?patientId=' + id)
                const examsRes = await axios.get('http://localhost:3000/exams?patientId=' + id)

                setPatient(patientRes.data)
                setConsults(consultsRes.data)
                setExams(examsRes.data)
            } catch (error) {
                console.error('Erro ao obter os detalhes do paciente', error)
                toast.error('Erro ao carregar os detalhes do paciente!', {
                    autoClose: 2000,
                    hideProgressBar: true,
                })
            }
        }

        fetchPatientDetails()
    }, [id])

    const parseDate = (date) => {
        if (!date) return new Date(0)
        if (date.includes('-')) {
            const parts = date.split('-')
            if (parts[0].length === 4) return new Date(date)
            return new Date(parts[2] + '-' + parts[1] + '-' + parts[0])
        }
        if (date.includes('/')) {
            const [day, month, year] = date.split('/')
            return new Date(year + '-' + month + '-' + day)
        }
        return new Date(date)
    }

    const sortByDate = (items) => {
        return [...items].sort((a, b) => {
            const firstDate = parseDate(a.date)
            const secondDate = parseDate(b.date)
            return sortOrder === 'desc' ? secondDate - firstDate : firstDate - secondDate
        })
    }

    const sortedConsults = sortByDate(consults)
    const sortedExams = sortByDate(exams)

    const formatDate = (date) => {
        if (!date) return '-'
        const parsedDate = parseDate(date)
        if (Number.isNaN(parsedDate.getTime())) return date
        return parsedDate.toLocaleDateString('pt-BR')
    }

    const handleConsultEdit = (consult) => {
        setEditing(consult.id)
        setEditData({
            reason: consult.reason || '',
            date: consult.date || '',
            time: consult.time || '',
            description: consult.description || '',
            medication: consult.medication || '',
            dosagePrecautions: consult.dosagePrecautions || '',
        })
    }

    const handleConsultChange = (event) => {
        const { name, value } = event.target
        setEditData((prev) => ({ ...prev, [name]: value }))
    }

    const handleConsultSave = async (consultId) => {
        try {
            const consultToUpdate = consults.find((consult) => consult.id === consultId)
            const updatedConsult = { ...consultToUpdate, ...editData, patientId: id }

            await axios.put('http://localhost:3000/consults/' + consultId, updatedConsult)
            setConsults((prev) => prev.map((consult) => (consult.id === consultId ? updatedConsult : consult)))
            setEditing(null)
            toast.success('Consulta atualizada com sucesso!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        } catch (error) {
            console.error('Erro ao atualizar consulta', error)
            toast.error('Erro ao atualizar consulta!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        }
    }

    const handleConsultDelete = async (consultId) => {
        if (!confirm('Deseja excluir esta consulta?')) return

        try {
            await axios.delete('http://localhost:3000/consults/' + consultId)
            setConsults((prev) => prev.filter((consult) => consult.id !== consultId))
            toast.success('Consulta excluida com sucesso!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        } catch (error) {
            console.error('Erro ao excluir consulta', error)
            toast.error('Erro ao excluir consulta!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        }
    }

    const handleExamEdit = (exam) => {
        setEditingExam(exam.id)
        setEditExamData({
            name: exam.name || '',
            date: exam.date || '',
            time: exam.time || '',
            type: exam.type || '',
            laboratory: exam.laboratory || '',
            documentUrl: exam.documentUrl || '',
            results: exam.results || '',
        })
    }

    const handleExamChange = (event) => {
        const { name, value } = event.target
        setEditExamData((prev) => ({ ...prev, [name]: value }))
    }

    const handleExamSave = async (examId) => {
        try {
            const examToUpdate = exams.find((exam) => exam.id === examId)
            const updatedExam = { ...examToUpdate, ...editExamData, patientId: id }

            await axios.put('http://localhost:3000/exams/' + examId, updatedExam)
            setExams((prev) => prev.map((exam) => (exam.id === examId ? updatedExam : exam)))
            setEditingExam(null)
            toast.success('Exame atualizado com sucesso!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        } catch (error) {
            console.error('Erro ao atualizar exame', error)
            toast.error('Erro ao atualizar exame!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        }
    }

    const handleExamDelete = async (examId) => {
        if (!confirm('Deseja excluir este exame?')) return

        try {
            await axios.delete('http://localhost:3000/exams/' + examId)
            setExams((prev) => prev.filter((exam) => exam.id !== examId))
            toast.success('Exame excluido com sucesso!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        } catch (error) {
            console.error('Erro ao excluir exame', error)
            toast.error('Erro ao excluir exame!', {
                autoClose: 2000,
                hideProgressBar: true,
            })
        }
    }

    const handleExportPdf = () => {
        if (!patient) return

        const consultsHtml = sortedConsults.map((consult) => [
            '<li>',
            '<strong>' + (consult.reason || '-') + '</strong><br />',
            'Data: ' + formatDate(consult.date) + ' - Horario: ' + (consult.time || '-') + '<br />',
            'Descricao: ' + (consult.description || '-') + '<br />',
            'Medicacao: ' + (consult.medication || '-') + '<br />',
            'Dosagem e precaucoes: ' + (consult.dosagePrecautions || '-'),
            '</li>',
        ].join('')).join('')

        const examsHtml = sortedExams.map((exam) => [
            '<li>',
            '<strong>' + (exam.name || '-') + '</strong><br />',
            'Data: ' + formatDate(exam.date) + ' - Horario: ' + (exam.time || '-') + '<br />',
            'Tipo: ' + (exam.type || '-') + '<br />',
            'Laboratorio: ' + (exam.laboratory || '-') + '<br />',
            'Resultados: ' + (exam.results || '-'),
            '</li>',
        ].join('')).join('')

        const printWindow = window.open('', '_blank')
        printWindow.document.write([
            '<html>',
            '<head>',
            '<title>Prontuario - ' + patient.fullName + '</title>',
            '<style>',
            'body { font-family: Arial, sans-serif; color: #111827; padding: 32px; line-height: 1.5; }',
            'h1, h2 { color: #155e75; }',
            'section { margin-bottom: 28px; }',
            'ul { padding-left: 20px; }',
            'li { margin-bottom: 16px; }',
            '.info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }',
            '</style>',
            '</head>',
            '<body>',
            '<h1>Prontuario do Paciente</h1>',
            '<section class="info">',
            '<p><strong>Nome:</strong> ' + (patient.fullName || '-') + '</p>',
            '<p><strong>Registro:</strong> ' + (patient.id || '-') + '</p>',
            '<p><strong>Email:</strong> ' + (patient.email || '-') + '</p>',
            '<p><strong>Telefone:</strong> ' + (patient.phone || '-') + '</p>',
            '<p><strong>Convenio:</strong> ' + (patient.healthInsurance || '-') + '</p>',
            '<p><strong>CPF:</strong> ' + (patient.cpf || '-') + '</p>',
            '</section>',
            '<section><h2>Consultas</h2><ul>' + (consultsHtml || '<li>Nenhuma consulta cadastrada.</li>') + '</ul></section>',
            '<section><h2>Exames</h2><ul>' + (examsHtml || '<li>Nenhum exame cadastrado.</li>') + '</ul></section>',
            '</body>',
            '</html>',
        ].join(''))
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
    }

    if (!patient) {
        return <p className="text-gray-600 dark-readable">Carregando detalhes do paciente...</p>
    }

    return (
        <section className="space-y-6 text-gray-800 dark-readable">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link to="/prontuarios" className="inline-flex items-center gap-2 text-cyan-700 font-semibold hover:underline dark-link">
                        <FaArrowLeft /> Voltar para prontuarios
                    </Link>
                    <h2 className="text-2xl font-bold text-cyan-800 mt-3 dark-title">Detalhes do Paciente</h2>
                </div>

                <button
                    onClick={handleExportPdf}
                    className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                >
                    <FaFilePdf /> Exportar PDF
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 details-card">
                <h3 className="text-xl font-semibold text-cyan-800 mb-4 dark-title">{patient.fullName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <p><strong>Registro:</strong> {patient.id}</p>
                    <p><strong>Genero:</strong> {patient.gender || '-'}</p>
                    <p><strong>Nascimento:</strong> {formatDate(patient.birthdate)}</p>
                    <p><strong>CPF:</strong> {patient.cpf || '-'}</p>
                    <p><strong>RG:</strong> {patient.rg || '-'}</p>
                    <p><strong>Telefone:</strong> {patient.phone || '-'}</p>
                    <p><strong>Email:</strong> {patient.email || '-'}</p>
                    <p><strong>Convenio:</strong> {patient.healthInsurance || '-'}</p>
                    <p><strong>Alergias:</strong> {patient.allergies || '-'}</p>
                    <p><strong>Cuidados especiais:</strong> {patient.specialCare || '-'}</p>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    className="inline-flex items-center gap-2 border border-cyan-700 text-cyan-700 px-4 py-2 rounded-lg hover:bg-cyan-50 transition sort-button"
                >
                    {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                    {sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="bg-white rounded-lg shadow p-6 details-card">
                    <h3 className="text-xl font-semibold text-cyan-800 mb-4 dark-title">Consultas</h3>

                    {sortedConsults.length > 0 ? (
                        <ul className="space-y-4">
                            {sortedConsults.map((consult) => (
                                <li key={consult.id} className="border rounded-lg p-4 details-item">
                                    {editing === consult.id ? (
                                        <div className="space-y-3">
                                            <input name="reason" value={editData.reason} onChange={handleConsultChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Motivo" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="date" name="date" value={editData.date} onChange={handleConsultChange} className="w-full border p-2 rounded-lg input-dark" />
                                                <input type="time" name="time" value={editData.time} onChange={handleConsultChange} className="w-full border p-2 rounded-lg input-dark" />
                                            </div>
                                            <textarea name="description" value={editData.description} onChange={handleConsultChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Descricao" />
                                            <input name="medication" value={editData.medication} onChange={handleConsultChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Medicacao" />
                                            <input name="dosagePrecautions" value={editData.dosagePrecautions} onChange={handleConsultChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Dosagem e precaucoes" />
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setEditing(null)} className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancelar</button>
                                                <button onClick={() => handleConsultSave(consult.id)} className="px-3 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600">Salvar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-semibold text-gray-800 dark-readable">{consult.reason}</p>
                                            <p className="text-sm text-gray-600 dark-muted">{formatDate(consult.date)} as {consult.time || '-'}</p>
                                            <p className="text-sm mt-2"><strong>Descricao:</strong> {consult.description || '-'}</p>
                                            <p className="text-sm"><strong>Medicacao:</strong> {consult.medication || '-'}</p>
                                            <p className="text-sm"><strong>Dosagem e precaucoes:</strong> {consult.dosagePrecautions || '-'}</p>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <button onClick={() => handleConsultEdit(consult)} className="px-3 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600">Editar</button>
                                                <button onClick={() => handleConsultDelete(consult.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">Excluir</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark-muted">Nenhuma consulta cadastrada para este paciente.</p>
                    )}
                </section>

                <section className="bg-white rounded-lg shadow p-6 details-card">
                    <h3 className="text-xl font-semibold text-cyan-800 mb-4 dark-title">Exames</h3>

                    {sortedExams.length > 0 ? (
                        <ul className="space-y-4">
                            {sortedExams.map((exam) => (
                                <li key={exam.id} className="border rounded-lg p-4 details-item">
                                    {editingExam === exam.id ? (
                                        <div className="space-y-3">
                                            <input name="name" value={editExamData.name} onChange={handleExamChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Nome do exame" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="date" name="date" value={editExamData.date} onChange={handleExamChange} className="w-full border p-2 rounded-lg input-dark" />
                                                <input type="time" name="time" value={editExamData.time} onChange={handleExamChange} className="w-full border p-2 rounded-lg input-dark" />
                                            </div>
                                            <input name="type" value={editExamData.type} onChange={handleExamChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Tipo" />
                                            <input name="laboratory" value={editExamData.laboratory} onChange={handleExamChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Laboratorio" />
                                            <input name="documentUrl" value={editExamData.documentUrl} onChange={handleExamChange} className="w-full border p-2 rounded-lg input-dark" placeholder="URL do documento" />
                                            <textarea name="results" value={editExamData.results} onChange={handleExamChange} className="w-full border p-2 rounded-lg input-dark" placeholder="Resultados" />
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setEditingExam(null)} className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancelar</button>
                                                <button onClick={() => handleExamSave(exam.id)} className="px-3 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600">Salvar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-semibold text-gray-800 dark-readable">{exam.name}</p>
                                            <p className="text-sm text-gray-600 dark-muted">{formatDate(exam.date)} as {exam.time || '-'}</p>
                                            <p className="text-sm mt-2"><strong>Tipo:</strong> {exam.type || '-'}</p>
                                            <p className="text-sm"><strong>Laboratorio:</strong> {exam.laboratory || '-'}</p>
                                            <p className="text-sm"><strong>Resultados:</strong> {exam.results || '-'}</p>
                                            {exam.documentUrl && (
                                                <a href={exam.documentUrl} target="_blank" className="inline-block text-cyan-700 font-semibold hover:underline mt-2 dark-link">
                                                    Ver documento
                                                </a>
                                            )}
                                            <div className="flex justify-end gap-2 mt-4">
                                                <button onClick={() => handleExamEdit(exam)} className="px-3 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600">Editar</button>
                                                <button onClick={() => handleExamDelete(exam.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">Excluir</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark-muted">Nenhum exame cadastrado para este paciente.</p>
                    )}
                </section>
            </div>
        </section>
    )
}

export default PatientDetails
