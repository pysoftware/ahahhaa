import React, {useState, useEffect} from 'react';
import {Bar} from 'react-chartjs-2'
import {Loader} from "./Loading";
import moment from 'moment';
import Swal from 'sweetalert2';

export const PostAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState([]);

    useEffect(() => {
        axios.get(`http://v258027.hosted-by-vdsina.ru/api/groups/${groupID}/posts/${postID}`)
            .then(response => {
                console.log(response.data);
                setPost(response.data);
                setLoading(false);
            }).catch(error => {
            console.log(error);
            setLoading(false);
        })
    }, [])

    if (!loading && !post.success) {
        Swal.fire({
            title: 'Ошибка',
            text: post.message,
            icon: 'warning',
            confirmButtonColor: '#1ed62b',
            confirmButtonText: 'Вернуться на главную страницу'
        }).then(result => {
            if (result.value) {
                window.location = '/'
            }
        })
    }

    if (loading) {
        return (
            <Loader/>
        )
    }

    console.log(post.data.counters.map((item) => {
        return item.likes_count
    }), post.data.counters.map((item) => {
        return item.views_count
    }));

    const config = {
        labels: post.data.counters.map((item) => {
            return moment(item.created_at).locale('ru').format('lll');
        }),
        datasets: [{
            label: 'Лайки',
            type: 'line',
            data: post.data.counters.map((item) => {
                return item.likes_count
            }),
            fill: false,
            borderColor: '#EC932F',
            backgroundColor: '#EC932F',
            pointBorderColor: '#EC932F',
            pointBackgroundColor: '#EC932F',
            pointHoverBackgroundColor: '#EC932F',
            pointHoverBorderColor: '#EC932F',
            yAxisID: 'y-axis-2'
        }, {
            type: 'bar',
            label: 'Просмотры',
            data: post.data.counters.map((item) => {
                return item.views_count
            }),
            fill: false,
            backgroundColor: '#71B37C',
            borderColor: '#71B37C',
            hoverBackgroundColor: '#71B37C',
            hoverBorderColor: '#71B37C',
            yAxisID: 'y-axis-1'
        }]
    };

    const options = {
        responsive: true,
        tooltips: {
            mode: 'label'
        },
        elements: {
            line: {
                fill: false
            }
        },
        scales: {
            xAxes: [
                {
                    display: true,
                    gridLines: {
                        display: false
                    }
                }
            ],
            yAxes: [
                {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        precision: 0,
                    },
                },
                {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        precision: 0,
                    },
                }
            ]
        }
    };

    return (
        <div className={'container'} style={{padding: 10}}>
            <h6>
                <a href="/">
                    Вернуться назад
                </a>
            </h6>
            <h4>
                <a href={`https://vk.com/wall-${groupID}_${postID}`}>
                    Ссылка на пост
                </a>
            </h4>
            <Bar
                data={config}
                options={options}
            />
        </div>
    )
}
