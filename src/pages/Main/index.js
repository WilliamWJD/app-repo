import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';

const Main = () => {
    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorRepo, setErrorRepo] = useState(false);

    useEffect(() => {
        async function loadRepositories() {
            const repo = localStorage.getItem('repositories');
            if (repo) {
                setRepositories(JSON.parse(repo));
            }
        }
        loadRepositories();
    }, []);

    useEffect(() => {
        localStorage.setItem('repositories', JSON.stringify(repositories));
    }, [repositories]);

    async function handleSubmit(e) {
        try {
            e.preventDefault();

            setLoading(true);

            if (newRepo === '') {
                setErrorRepo(true);
                throw new Error('Insira um repositório válido');
            }

            const checkRepoExist = repositories.find(
                (repo) => repo.name === newRepo
            );

            if (checkRepoExist) {
                setErrorRepo(true);
                throw new Error('Repositório duplicado');
            }

            const response = await api.get(`/repos/${newRepo}`);

            const data = { name: response.data.full_name };

            setRepositories([...repositories, data]);
            setNewRepo('');
            setLoading(false);
            setErrorRepo(false);
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <h1>
                <FaGithubAlt />
                Repositórios
            </h1>

            <Form onSubmit={handleSubmit} errorRepo={errorRepo}>
                <input
                    type="text"
                    placeholder="Adicionar repositório"
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                />
                <SubmitButton loading={loading}>
                    {loading ? (
                        <FaSpinner color="#fff" size={14} />
                    ) : (
                        <FaPlus color="#fff" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositories.map((repo) => (
                    <li key={repo.name}>
                        <span>{repo.name}</span>
                        <Link
                            to={`/repository/${encodeURIComponent(repo.name)}`}
                        >
                            Detalhes
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    );
};

export default Main;
