import styled from 'styled-components/native';
import { css } from 'styled-components';

export const MyAppText = styled.Text<{
    bold?: boolean;
    size?: 'normal' | 'large';
    color?: string;
    space?: string;
    marginTop?: number;
    marginBottom?: number;
}>`
    ${p => css`
    font-family: 'Pretendard-Regular';
    font-size: ${p.size === 'large' ? p.theme.fonts.large : p.theme.fonts.normal};
    font-weight: ${p.bold ? p.theme.fonts.bold : p.theme.fonts.regular};
    color: ${p.color ? p.color : p.theme.fontColor.basic};
    letter-spacing: ${p.space ? p.space : ''};
    margin-top: ${p.marginTop ? p.marginTop : ''};
    margin-bottom: ${p.marginBottom ? p.marginBottom : ''};
  `}// font-family: 'Pretendard-Regular';
                    // font-size: ${({ size, theme }) => (size === 'large' ? theme.fonts.large : theme.fonts.normal)};
                    // font-weight: ${({ bold, theme }) => (bold ? theme.fonts.bold : theme.fonts.regular)};
                    // color: ${({ color, theme }) => (color ? color : theme.fontColor.basic)};
                    // letter-spacing: ${({ space, theme }) => (space ? space : '')};
                    // margin-top: ${({ marginTop }) => (marginTop ? marginTop : '')};
                    // margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : '')};
`;
