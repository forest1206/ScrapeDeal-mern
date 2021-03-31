// react
import React, { Fragment } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// application
import { ArrowRoundedLeft6x9Svg, Check9x7Svg } from '../../svg';
import { url } from '../../services/utils';

function FilterCategory(props) {
    const { data, value, onChangeValue } = props;

    const handleAllClick = () => {
        onChangeValue({ filter: data, value: [] });
    };

    const updateValue = (newValue) => {
        onChangeValue({ filter: data, value: newValue });
    };

    const handleChange = (event) => {
        if (event.target.checked && !value.includes(event.target.value)) {
            updateValue([...value, event.target.value]);
        }
        if (!event.target.checked && value.includes(event.target.value)) {
            updateValue(value.filter((x) => x !== event.target.value));
        }
    };

    const categoriesList = data.items.map((item) => {
        let count;

        if (item.count) {
            count = <span className="filter-list__counter">{item.count}</span>;
        }

        const itemClasses = classNames('filter-list__item', {
            'filter-list__item--disabled': item.count === 0,
        });

        return (
            <label key={item.slug} className={itemClasses}>
                <span className="filter-list__input input-check">
                    <span className="input-check__body">
                        <input
                            className="input-check__input"
                            type="checkbox"
                            value={item.slug}
                            checked={value.includes(item.slug)}
                            disabled={item.count === 0}
                            onChange={handleChange}
                        />
                        <span className="input-check__box" />
                        <Check9x7Svg className="input-check__icon" />
                    </span>
                </span>
                <span className="filter-list__title">{item.name}</span>
                {count}
            </label>
        );
    });

    if (data.value) {
        categoriesList.unshift(
            <li key="[shop]" className="filter-categories__item filter-categories__item--parent">
                <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
                <p style={{ cursor: 'pointer' }} onClick={handleAllClick}>All Products</p>
            </li>,
        );
    }

    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">
                {categoriesList}
            </ul>
        </div>
    );
}

FilterCategory.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
};

export default FilterCategory;
