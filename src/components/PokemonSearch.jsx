import React from 'react'

export default function PokemonSearch({ value, onChange, placeholder }) {
    return (
        <div className="max-w-md mx-auto mb-6 px-4">
            <input
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg shadow-sm"
            />
        </div>
    )
}
