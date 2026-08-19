import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { useState } from 'react';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AdminPage = () => {
    const [name, setName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault()

        await fetch(`${URL}/api/categories`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    teacherId: 3,
                })
            }
        )
        setName("");
    }

    return (
        <div className='page'>
            <Header />
            <main className="page-content">
                <h1 className="stage-title">Create new quiz</h1>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                        Category
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Category name"
                        />
                    </label>
                    <button type="submit">Add category</button>
                </form>
            </main>
            <Footer />
        </div>

    )
}
