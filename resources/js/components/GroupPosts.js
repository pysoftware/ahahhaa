import React, {useState, useEffect} from 'react';
import Swal from 'sweetalert2'
import {Loader} from "./Loading";

export const GroupPosts = () => {
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [saveInput, setSaveInput] = useState('');
    const [input, setInput] = useState('');
    const [posts, setPosts] = useState([]);
    const [ids, setIds] = useState([]);

    useEffect(() => {
        if (loading) {
            axios.get(`http://v258027.hosted-by-vdsina.ru/api/groups`)
                .then(response => {
                    setIds(response.data.data);
                    setLoading(false);
                }).catch(error => {
                console.log(error);
                setLoading(false);
            });
        }
    }, []);

    if (loading) {
        return (
            <Loader/>
        )
    }

    const handleStore = () => {
        if (saveInput === '') {
            Swal.fire({
                title: 'Ошибка',
                text: 'Введите корректный ID сообщества для сохранения',
                icon: 'warning',
                confirmButtonColor: '#1ed62b',
                confirmButtonText: 'Ок'
            })
            return;
        }
        axios.post(`http://v258027.hosted-by-vdsina.ru/api/groups`, {
            group_id: saveInput
        }).then(response => {
            console.log(response.data);
            if (response.data.success === false) {
                Swal.fire({
                    title: 'Ошибка',
                    text: response.data.message,
                    icon: 'warning',
                    confirmButtonColor: '#1ed62b',
                    confirmButtonText: 'Ок'
                })
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Группа успешно добавлена',
                    showConfirmButton: true,
                    timer: 700
                });
                setIds([...ids, response.data.data]);
            }

        }).catch(error => {
            console.log('ahah', error.message);
        })
    }

    const handleSearch = () => {
        if (input === '') {
            Swal.fire({
                title: 'Ошибка',
                text: 'Введите корректный ID сообщества для поиска',
                icon: 'warning',
                confirmButtonColor: '#1ed62b',
                confirmButtonText: 'Ок'
            })
            return;
        }
        setPostsLoading(true);
        axios.get(`http://v258027.hosted-by-vdsina.ru/api/groups/${input}`)
            .then(response => {
                console.log(response.data);
                if (response.data.success === false) {
                    Swal.fire({
                        title: 'Ошибка',
                        text: response.data.message,
                        icon: 'warning',
                        confirmButtonColor: '#1ed62b',
                        confirmButtonText: 'Ок'
                    })
                    setPostsLoading(false);
                } else {
                    setPosts(response.data);
                    setPostsLoading(false);
                }
            }).catch(error => {
            console.log(error);
            setPostsLoading(false);
        })
    }

    const handleInput = (value) => {
        setInput(value);
    }

    const handleSaveInput = (value) => {
        setSaveInput(value);
    }

    return (
        <div>
            <div className={'container'} style={{padding: 10}}>
                <h4>Начать трекать группу: *</h4>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="ID сообщества ВКонтакте"
                           aria-label="Recipient's username" aria-describedby="button-addon2"
                           onChange={event => handleSaveInput(event.target.value)}/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button" id="button-addon2" onClick={handleStore}>
                            Сохранить
                        </button>
                    </div>
                </div>
                <h1>Поиск группы: *</h1>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="ID сообщества ВКонтакте*"
                           aria-label="Recipient's username" aria-describedby="button-addon2"
                           onChange={event => handleInput(event.target.value)}/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button" id="button-addon2" onClick={handleSearch}>
                            Искать
                        </button>
                    </div>
                </div>

                <h6>Сообщества под наблюдением</h6>
                {
                    (() => {
                        if (ids.length > 0) {
                            return ids.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <a href={`https://vk.com/public${item.group_id}`}>{item.group_id}</a>
                                    </div>
                                )
                            })
                        }
                        return (
                            <p>Пока нет ни одного</p>
                        )
                    })()
                }
                {
                    postsLoading
                        ? (
                            <Loader/>
                        ) : (() => {
                            if (!posts.data) {
                                return (
                                    <div className={'text-center'}>

                                    </div>
                                )
                            }
                            if (posts.data.length === 0) {
                                return (
                                    <div className={"text-center"}>
                                        <h4>Данные собираются... Приходите позже</h4>
                                    </div>
                                )
                            }
                            return posts.data.map((item, index) => {
                                const uri = `https://vk.com/wall-${item.group_id}_${item.post_id}`;
                                return (
                                    <div key={index}>
                                        <h4>
                                            <a href={uri}>
                                                Пост {item.post_id}
                                            </a>
                                            &nbsp;&nbsp;
                                            <a href={`/groups/${item.group_id}/posts/${item.post_id}`}>
                                                Анализ поста
                                            </a>
                                        </h4>
                                    </div>
                                )
                            })
                        })()
                }
            </div>
        </div>
    )
}
