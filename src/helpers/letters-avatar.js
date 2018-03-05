import Canvas from 'canvas';

const styles = [
  {
    color: '#ffd91b',
    background: '#fff2c4',
  },
  {
    color: '#bf3e3a',
    background: '#ffced1',
  },
  {
    color: '#73df89',
    background: '#d6f5dd',
  },
  {
    color: '#a8a3ed',
    background: '#e4e4f8',
  },
  {
    color: '#64d4f5',
    background: '#d3f2fA',
  },
];
const getRandomStyle = () => styles[Math.floor(Math.random() * (styles.length - 1))];
const size = 300;

export const getAvatarFromText = (text) => {
  const canvas = new Canvas(size, size);
  const context = canvas.getContext('2d');
  const style = getRandomStyle();
  context.fillStyle = style.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = 'bold 130px Arial';
  context.textAlign = 'center';
  context.fillStyle = style.color;
  context.fillText(`${text[0]}${text[1]}`.toUpperCase(), (size / 2) - 5, size / 1.5);
  return canvas.toDataURL();
};
