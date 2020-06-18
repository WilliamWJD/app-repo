import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';

export default class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        errorRepo: false,
    };

    componentDidMount() {
        const repositories = localStorage.getItem('repositories');
        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = (e) => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async (e) => {
        try {
            e.preventDefault();

            this.setState({ loading: true });

            const { newRepo, repositories } = this.state;

            if (newRepo === '') {
                this.setState({ errorRepo: true });
                throw new Error('Insira um repositório válido');
            }

            const checkRepoExist = repositories.find(
                (repo) => repo.name === newRepo
            );

            if (checkRepoExist) {
                this.setState({ errorRepo: true });
                throw new Error('Repositório duplicado');
            }

            const response = await api.get(`/repos/${newRepo}`);

            const data = { name: response.data.full_name };
            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false,
                errorRepo: false,
            });
        } catch (error) {
            alert(error);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { newRepo, loading, repositories, errorRepo } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit} errorRepo={errorRepo}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
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
                                to={`/repository/${encodeURIComponent(
                                    repo.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
