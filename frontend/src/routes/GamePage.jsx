import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { useState, useEffect } from 'react';

const URL = 'http://localhost:3000';

export const GamePage = () => {

    const [teachers, setTeachers] = useState([]);
    const [teacherId, setTeacherId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [position, setPosition] = useState(0);
    const [selectedOption, setOption] = useState(null);
    const [points, setPoints] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    
    
    const currentQuestion = questions[position];

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setQuestions([]);
        setPosition(0);
        setPoints(0);
        setOption(null);
        setIsFinished(false);
        setIsLoadingQuestions(true);
    };

    const handleBack = () => {
        if (selectedCategory !== null || isFinished) {
            setSelectedCategory(null);
            setQuestions([]);
            setPosition(0);
            setPoints(0);
            setOption(null);
            setIsFinished(false);
            return;
        }

        if (teacherId !== null) {
            setTeacherId(null);
            setCategories([]);
        }
    };
    const handleSelectAnswer = (option) => {
        setOption(option);
    };

    const handleSelectTeacher = (id) => {
        setTeacherId(id);
        setCategories([]);
        setSelectedCategory(null);
        setQuestions([]);
        setPosition(0);
        setOption(null);
        setPoints(0);
        setIsFinished(false);
    };

    const handleSaveAnswer = () => {
        if (selectedOption === null || !currentQuestion) {
            return;
    }

        const isCorrect = selectedOption === currentQuestion.correct_option;
        const isLastQuestion = position === questions.length - 1;

        if (isLastQuestion) {
            setPoints((previousPoints) => {
                const result = isCorrect
                    ? previousPoints + 1
                    : previousPoints;

                setPoints(result);
                return result;
            });

            setIsFinished(true);
            return;
        }

        if (isCorrect) {
            setPoints((previousPoints) => previousPoints + 1);
        }

        setPosition((previousPosition) => previousPosition + 1);
        setOption(null);
    };

    useEffect(() => {
        fetch(`${URL}/api/teachers`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                return response.json();
            })
            .then(data => setTeachers(data))
            .catch(error => console.error('Error fetching teachers:', error));
    }, []);

    useEffect(() => {
        if (teacherId !== null) {
            fetch(`${URL}/api/categories?teacherId=${teacherId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch categories');
                    }
                    return response.json();
                })
                .then(data => setCategories(data))
                .catch(error => console.error('Error fetching categories:', error));
        }
    }, [teacherId]);

    useEffect(() => {
        if (selectedCategory === null) {
            return;
        }

        fetch(`${URL}/api/questions?categoryId=${selectedCategory.id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }

                return response.json();
            })
            .then((data) => {
                setQuestions(data);
                setPosition(0);
            })
            .catch((error) => console.error('Error fetching questions:', error))
            .finally(() => setIsLoadingQuestions(false));
    }, [selectedCategory]);

    return (

        <div className="page">

            <Header />
            <main className="page-content">
            {/* select teacher */}
            {teacherId === null && ( <div> 
                <h2 className="stage-title">Valitse opettaja</h2>
                
                <div className="teachers-container">
                    {teachers.map(teacher => (
                            <div className="teachers-card" key={teacher.id} onClick={() => handleSelectTeacher(teacher.id)}>
                                <h3>{teacher.username}</h3>
                            </div>
                    ))}
                </div>
                
            </div> )
            }

            {/* select category */}
            {teacherId !== null && selectedCategory === null && (
                <div>
                    <h2 className="stage-title">Kategoriat</h2>
                        <div className="category-container">
                        {categories.map(category => (
                            <div className="category-card" key={category.id} onClick={() => handleSelectCategory(category)}>
                                <h3>{category.name}</h3>
                            </div>
                        ))}
                        </div>
                </div>
            )}
            {/* select quiz */}
            {selectedCategory !== null && isLoadingQuestions && (
        <p>Ladataan kysymyksiä...</p>
    )}

    {selectedCategory !== null &&
        !isLoadingQuestions &&
        questions.length === 0 &&
        !isFinished && (
            <p>Tässä kategoriassa ei ole kysymyksiä.</p>
        )}

    {currentQuestion && !isFinished && (
        <div>
            <h2 className="stage-title">
                Kysymys {position + 1} / {questions.length}
            </h2>

            <h3 className="question">{currentQuestion.question}</h3>

            <div className="answers-card">
                <button
                    type="button"
                    className={`option-a ${selectedOption === 'A' ? 'selected-answer' : ''}`}
                    onClick={() => handleSelectAnswer('A')}
                >
                    {currentQuestion.option_a}
                </button>

                <button
                    type="button"
                    className={`option-b ${selectedOption === 'B' ? 'selected-answer' : ''}`}
                    onClick={() => handleSelectAnswer('B')}
                >
                    {currentQuestion.option_b}
                </button>

                <button
                    type="button"
                    className={`option-c ${selectedOption === 'C' ? 'selected-answer' : ''}`}
                    onClick={() => handleSelectAnswer('C')}
                >
                    {currentQuestion.option_c}
                </button>

                <button
                    type="button"
                    className={`option-d ${selectedOption === 'D' ? 'selected-answer' : ''}`}
                    onClick={() => handleSelectAnswer('D')}
                >
                    {currentQuestion.option_d}
                </button>
            </div>

            <div className="game-actions">
                <button
                    type="button"
                    onClick={handleSaveAnswer}
                    disabled={selectedOption === null}
                >
                    {position === questions.length - 1
                        ? 'Lopeta tietovisa'
                        : 'Tallenna vastaus'}
                </button>
            </div>
        </div>
    )}

    {isFinished && (
        <div>
            <h2 className="stage-title">Tietovisa on päättynyt!</h2>

            <p className="question">
                Tuloksesi: {points} / {questions.length}
            </p>

            <div className="game-actions">
                <button
                    type="button"
                    onClick={() => {
                        setSelectedCategory(null);
                        setQuestions([]);
                        setPosition(0);
                        setPoints(0);
                        setOption(null);
                        setIsFinished(false);
                    }}
                >
                    Valitse toinen kategoria
                </button>
            </div>
        </div>
    )}

        {/* func button */}

            {teacherId !== null && (
                <div className="game-actions">
                    <button
                        type="button"
                        className="back-button"
                        onClick={handleBack}
                    >
                        Takaisin
                    </button>
            </div>
            )}

            </main>

            <Footer />
        </div>

    )

}