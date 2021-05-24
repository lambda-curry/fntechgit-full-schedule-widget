import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FallbackImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            src: props.src,
            errored: false,
        };
    }

    onError = () => {
        if (!this.state.errored) {
            this.setState({
                src: this.props.fallbackSrc,
                errored: true,
            });
        }
    }

    render() {
        const { src, errored } = this.state;
        const {
            src: _1,
            fallbackSrc: _2,
            ...props
        } = this.props;

        if (errored && !this.props.fallbackSrc) {
            return (<i className="fa fa-picture-o" aria-hidden="true" />);
        }

        return (
            <img
                src={src}
                onError={this.onError}
                {...props}
            />
        );
    }
}

FallbackImage.propTypes = {
    src: PropTypes.string,
    fallbackSrc: PropTypes.string,
};

export default FallbackImage;