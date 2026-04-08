import React from 'react'

const LoginForm = () => {
  return (
    <>
        <div className='flex items-center justify-center min-h-screen'>
            <form className='p-6 border rounded shadow-md space-y-4'>
                <h1 className='text-5xl font-bold flex justify-center'>Login</h1>
                <input
                    type='email'
                    placeholder='Digite seu email'
                    className='w-full px-3 py-2 border rounded'
                />
                <input
                    type='password'
                    placeholder='Digite sua senha'
                    className='w-full px-3 py-2 border rounded'
                />
                <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
                    Entrar
                </button>
                <p className='flex justify-center text-sm text-gray-600'>
    
                </p>
            </form>
        </div>
    </>
  )
}

export default LoginForm