import React, { useEffect } from "react";
import axios from "axios";

const slideWidth = 30;

const sleep = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const createItem = (position, idx, data, length) => {
    const item = {
        styles: {
            transform: `translateX(${position * slideWidth}rem)`,
        },
        show: data[idx].show,
    };

    switch (position) {
        case length - 1:
        case length + 1:
            item.styles = {...item.styles};
            break;
        case length:
            break;
        default:
            item.styles = {...item.styles, opacity: 0};
            break;
    }

    return item;
};

const CarouselSlideItem = ({pos, idx, data, length, activeIdx}) => {
    const item = createItem(pos, idx, data, length, activeIdx);

    return (
        <li className="carousel__slide-item" style={item.styles}>
            <div className="carousel__slide-item-img-link">
                <img src={item.show.image} alt={item.show.title} />
            </div>
        </li>
    );
};

// const keys = Array.from(Array(_items.length).keys());

export default function App () {
    const [data, setData] = React.useState([]);
    const [items, setItems] = React.useState([]);
    const [length, setLength] = React.useState(0);
    const [isTicking, setIsTicking] = React.useState(false);
    const [activeIdx, setActiveIdx] = React.useState(0);
    const bigLength = items.length;
    const listWidth = (items.length + 1) * slideWidth;

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/').then(function (response) {
        const _items = response.data;
        setLength(response.data.length);
        _items.push(..._items);
        setData(_items);
        const keys = Array.from(Array(_items.length).keys());
        setItems(keys);
      }).catch(function (error) {
        console.error(error);
      });
    }, []);

    const prevClick = (jump = 1) => {
        if (!isTicking) {
            setIsTicking(true);
            setItems((prev) => {
                return prev.map((_, i) => prev[(i + jump) % bigLength]);
            });
        }
    };

    const nextClick = (jump = 1) => {
        if (!isTicking) {
            setIsTicking(true);
            setItems((prev) => {
                return prev.map(
                    (_, i) => prev[(i - jump + bigLength) % bigLength],
                );
            });
        }
    };

    const handleDotClick = (idx) => {
        if (idx < activeIdx) prevClick(activeIdx - idx);
        if (idx > activeIdx) nextClick(idx - activeIdx);
    };

    React.useEffect(() => {
        if (isTicking) sleep(300).then(() => setIsTicking(false));
    }, [isTicking]);

    React.useEffect(() => {
        setActiveIdx((length - (items[0] % length)) % length)
    }, [items]);

    return (
        <div>
            <h1 style = {{textAlign:'center'}}>Netflix Carousel</h1>
            <div className="carousel__wrap">
                <div className="carousel__inner">
                    <button className="carousel__btn carousel__btn--prev" onClick={() => prevClick()}>
                        <i className="carousel__btn-arrow carousel__btn-arrow--left" />
                    </button>
                    <div className="carousel__container">
                        <ul className="carousel__slide-list" style={{ width: `${listWidth}rem` }}>
                            {items.map((pos, i) => (
                                <CarouselSlideItem
                                    data={data}
                                    length={length}
                                    key={i}
                                    idx={i}
                                    pos={pos}
                                    activeIdx={activeIdx}
                                />
                            ))}
                        </ul>
                    </div>
                    <button className="carousel__btn carousel__btn--next" onClick={() => nextClick()}>
                        <i className="carousel__btn-arrow carousel__btn-arrow--right" />
                    </button>
                    <div className="carousel__dots">
                        {items.slice(0, length).map((pos, i) => (
                            <button
                                key={i}
                                onClick={() => handleDotClick(i)}
                                className={i === activeIdx ? 'dot active' : 'dot'}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


