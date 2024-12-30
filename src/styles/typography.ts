import styled from 'styled-components/native';

export const MyAppText = styled.Text<{ bold?: boolean; size?: 'normal' | 'large' }>`
  font-family: 'Pretendard-Regular';
  font-size: ${({ size, theme }) => (size === 'large' ? theme.fonts.large : theme.fonts.normal)};
  font-weight: ${({ bold, theme }) => (bold ? theme.fonts.bold : theme.fonts.regular)};
  color: ${({ theme }) => theme.color.text};
`;
