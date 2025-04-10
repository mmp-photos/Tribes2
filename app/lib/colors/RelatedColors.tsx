import React from 'react';
import { Color } from "../types/color";

interface RelatedColorsProps {
    colors: Color[];
    title: string;
}

const RelatedColors: React.FC<RelatedColorsProps> = ({ colors, title }) => {
    return (
        <div>
            <h4>{title}</h4>
            <ul className="no-bullets capitalize">
                {colors.map((relatedColor) => {
                    if (typeof relatedColor === 'object' && relatedColor !== null) {
                        return (
                            <li
                                key={relatedColor._id?.toString()}
                            >
                                <a href={`colors?id=${relatedColor._id?.toString()}`}>
                                    <span className="color-swatch-small"
                                    style={{ backgroundColor: `#${relatedColor.colorValue}` }}>&nbsp;</span>
                                </a>
                                {/* {relatedColor.colorName} */}
                            </li>
                        );
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export default RelatedColors;
