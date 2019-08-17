import Header from '../../Header';
import React from 'react';
import InlineSwatch from '../../InlineSwatch';
import ColorSpace from '../../ColorSpace';
import Page from '../../Page';
import Delta from '../../Delta';

export default ({ base }) => (
  <Page inverse>
    <div className="Tutorial-text">
      <Header hash="interactive-elements">Интерактивные элементы</Header>
      <p>
        Эта статья создана, чтобы дать вам возможность не только узнать новое,
        но и сразу проверить эти знания. Для этого используется набор
        интерактивных элементов, позволяющий изучать, сравнивать и оценивать
        цвета.
      </p>
      <p>
        Простейший из них — свотч, цветовая плашка:{' '}
        <InlineSwatch color="#00FF55" />. Свотч можно выделить курсором или
        пальцем, во всплывающем блоке можно больше узнать о цвете: название из
        базы имён, координаты в моделях RGB и HCL, оценку некоторых
        характеристик.
      </p>
      <p>
        Для описания различия пар цветов используется такое представление:{' '}
        <Delta c1="#FF0" c2="#00F" />. Оно объясняется и используется в блоке
        «Цветовые схемы».
      </p>
      <p>
        Наборы цветов изображены на трёхмерных визуализациях в контексте
        цветовых моделей. Каждую можно покрутить курсором или пальцем.
        Попробуйте:
      </p>
    </div>
    <div className="Tutorial-wide">
      <ColorSpace
        width={600}
        height={400}
        background={base[7]}
        gridOpacity={1}
        autoTilt
      />
    </div>
  </Page>
);
