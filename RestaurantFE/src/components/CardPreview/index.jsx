import { Box, Button, Card, CardMedia, Stack, Typography } from '@mui/material';
import React from 'react';
import FoodImage1 from '../../assets/FoodImage1.jpg';
import styles from './CardPreview.module.css';

export default function CardPreview() {
  return (
    <Box position='relative' className={styles.imageFrame}>
      <img src={FoodImage1} alt='food' className={styles.image} />
      <Stack spacing={1} position='absolute' className={styles.TextContainer}>
        <p
          style={{ fontSize: 30 }}
          className={`p__cormorant ${styles.textTitle}`}
        >
          Mì Spaghetti
        </p>
        <p className={`p__cormorant ${styles.textDescription}`}>
          Lorem ipsum dolor
        </p>
      </Stack>
      <Button size='small' className={styles.Button}>
        <p className='p__cormorant'>View More</p>
      </Button>
    </Box>
  );
}
