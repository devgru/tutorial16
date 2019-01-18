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
        Эта страница создана, чтобы дать вам возможность не только узнать новое,
        но и сразу проверить эти знания. Для этого используется набор
        интерактивных элементов.
      </p>
      <p>
        Простейший из них — свотч, цветовая плашка:{' '}
        <InlineSwatch color="#00FF55" />. Свотч можно выделить курсором или
        пальцем, во всплывающем блоке можно больше узнать о цвете: название (из
        базы имён), координаты в моделях RGB и HCL, оценку некоторых
        характеристик.
      </p>
      <p>
        Для описания различия пар цветов используется такое представление:{' '}
        <Delta c1="#FF0" c2="#00F" />. В тексте я расскажу, что оно обозначает.
      </p>
      <p>
        Наборы цветов в контексте цветовых моделей изображены на трёхмерных
        визуализациях. Каждую можно покрутить курсором или пальцем. Попробуйте:
      </p>
    </div>
    <div className="Tutorial-wide">
      <ColorSpace
        width={600}
        height={400}
        colors={[]}
        background={base[7]}
        gridOpacity={1}
        controlsOptions={{
          enableKeys: false,
          enableZoom: false,
        }}
      />
    </div>
  </Page>
);
