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
    const [groupLink, setGroupLink] = useState(null);
    const [isGroupSearched, setIsGroupSearched] = useState(false);

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
        let group_id;
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
        if (saveInput.includes('/')) {
            const tempSaveInput = saveInput.split('/');
            group_id = tempSaveInput[tempSaveInput.length - 1];
        } else {
            group_id = saveInput;
        }
        axios.post(`http://v258027.hosted-by-vdsina.ru/api/groups`, {
            group_id
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

    const handleSaveInput = (value) => {
        setSaveInput(value);
    }

    const handleDropdown = (id) => {
        setPostsLoading(true);
        axios.get(`http://v258027.hosted-by-vdsina.ru/api/groups/${id}`)
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
                    setIsGroupSearched(true);
                    setGroupLink(id);
                    setPosts(response.data);
                    setPostsLoading(false);
                }
            }).catch(error => {
            setIsGroupSearched(false);
            console.log(error);
            setPostsLoading(false);
        })
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
                {
                    (() => {
                        if (ids.length > 0) {
                            return (
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle  btn-lg btn-block"
                                            type="button" id="dropdownMenuButton"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Сообщества под наблюдением
                                    </button>
                                    <div className="dropdown-menu container text-center"
                                         aria-labelledby="dropdownMenuButton">
                                        {
                                            (() => {
                                                return ids.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <a
                                                                href={'#'}
                                                                onClick={() => handleDropdown(item.group_id)}>
                                                                {item.group_name}
                                                            </a>
                                                        </div>
                                                    )
                                                })
                                            })()
                                        }
                                    </div>
                                </div>
                            )
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
                        ) : (
                            <div>
                                {
                                    isGroupSearched
                                        ? (
                                            <div>
                                                <h1>
                                                    <a href={`https://vk.com/public${groupLink}`}
                                                       target={"_blank"}>
                                                        Ссылка на группу
                                                    </a>
                                                </h1>
                                                {
                                                    (() => {
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
                                                                        <a href={uri} target={"_blank"}>
                                                                            Пост {item.post_id}
                                                                        </a>
                                                                        &nbsp;&nbsp;
                                                                        <a href={`/groups/${item.group_id}/posts/${item.post_id}`}
                                                                           target={"_blank"}>
                                                                            Анализ поста
                                                                        </a>
                                                                    </h4>
                                                                </div>
                                                            )
                                                        })
                                                    })()
                                                }
                                            </div>
                                        )
                                        : (
                                            <div>

                                            </div>
                                        )
                                }
                            </div>
                        )
                }
            </div>
        </div>
    )
}
