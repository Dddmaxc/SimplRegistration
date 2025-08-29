import { ShoppingCart } from '@mui/icons-material';
import Button from '@mui/material/Button';
import * as React from 'react';

type SCartProps = {
  setOpen: (open: boolean) => void;
};

export const SCart = ({ setOpen }: SCartProps) => {
  return (
    <React.Fragment>
      <Button
        variant="text"             // без фона и границ
        onClick={() => setOpen(true)}
        disableRipple              // убирает "волну" при нажатии (необязательно)
        disableElevation           // убирает тень (для кнопок с elevation)
        sx={{
          minWidth: 0,
          padding: 0,
          color: 'inherit',        // сохраняет цвет иконки (наследует от AppBar)
        }}
      >
        <ShoppingCart />
      </Button>
    </React.Fragment>
  );
};
