import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { Loading, Owner, IssueList } from './styles';
import Container from '../../components/Container';

const Repository = (props) => {
    const [repository, setRepository] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        async function loadRepo() {
            const { match } = props;
            const repoName = decodeURIComponent(match.params.repository);

            const [repo, issu] = await Promise.all([
                api.get(`/repos/${repoName}`),
                api.get(`/repos/${repoName}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5,
                    },
                }),
            ]);

            setRepository(repo.data);
            setIssues(issu.data);
            setLoading(false);
        }
        loadRepo();
    }, []);

    return (
        <>
            {loading ? (
                <Loading>Carregando</Loading>
            ) : (
                <Container>
                    <Owner>
                        <Link to="/">Voltar aos repositórios</Link>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <h1>{repository.name}</h1>
                        <p>{repository.description}</p>
                    </Owner>

                    <select name="" id="">
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>

                    <IssueList>
                        {issues.map((issue) => (
                            <li key={String(issue.id)}>
                                <img
                                    src={issue.user.avatar_url}
                                    alt={issue.user.login}
                                />
                                <div>
                                    <strong>
                                        <a href={issue.html_url}>
                                            {issue.title}
                                        </a>
                                        {issue.labels.map((label) => (
                                            <span key={String(label.id)}>
                                                {label.name}
                                            </span>
                                        ))}
                                    </strong>
                                    <p>{issue.user.login}</p>
                                </div>
                            </li>
                        ))}
                    </IssueList>
                </Container>
            )}
        </>
    );
};

export default Repository;
