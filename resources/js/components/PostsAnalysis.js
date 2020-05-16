import React, {useState, useEffect} from 'react'
import {Loader} from "./Loading";
import axios from "axios";
import moment from 'moment';
import locale from 'locale';
import {HorizontalBar, Bar} from 'react-chartjs-2'

export const PostsAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [saveInput, setSaveInput] = useState('');
    const [input, setInput] = useState('');
    const [data, setData] = useState([]);



    return (
        <div>
            <div>
                <div className={'container'} style={{padding: 10}}>
                    <h1>Вставьте ID сообщества: *</h1>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Ссылка или ID сообщества ВКонтакте*"
                               aria-label="Recipient's username" aria-describedby="button-addon2"
                               onChange={event => handleInput(event.target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button" id="button-addon2" onClick={handleSearch}>
                                Искать
                            </button>
                        </div>
                    </div>
                    {
                        loading
                            ? <Loader/>
                            : (
                                () => {
                                    return data.map((item, index) => {

                                        const config = {
                                            labels: item.counters.map((item) => {
                                                return moment(item.created_at).locale('ru').format('lll');
                                            }),
                                            datasets: [{
                                                label: 'Лайки',
                                                type: 'line',
                                                data: item.counters.map((item) => {
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
                                                data: item.counters.map((item) => {
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
                                                        }
                                                    },
                                                    {
                                                        type: 'linear',
                                                        display: true,
                                                        position: 'right',
                                                        id: 'y-axis-2',
                                                        gridLines: {
                                                            display: false
                                                        },
                                                        labels: {
                                                            show: true
                                                        }
                                                    }
                                                ]
                                            }
                                        };

                                        return (
                                            <div key={index}>
                                                <h4><a href="#">Пост</a></h4>
                                                <Bar
                                                    data={config}
                                                    options={options}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            )()

                    }
                </div>
            </div>
        </div>
    )
}
