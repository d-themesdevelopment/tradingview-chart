import { ensureNotNull, ensureDefined } from "./assertions";
import { t } from "helpers/i18n"; // ! not correct
import { isStudy } from "models/Study"; // ! not correct
import { PriceScalePosition } from "models/Panes/PriceScalePosition"; // ! not correct

class PriceScaleSelectionStrategy {
  constructor(metaInfo) {
    this._priceScalesLimit = 8;
    this._metaInfo = metaInfo;
  }

  metaInfo() {
    return this._metaInfo;
  }

  findSuitableScale(pane, source, targetPriceScalePosition, sourceStudy) {
    if (targetPriceScalePosition !== undefined) {
      return this._tryToGetDesiredPriceScale(
        pane,
        source,
        targetPriceScalePosition,
        sourceStudy
      );
    }

    if (isStudy(source)) {
      const sourceMetaInfo = source.metaInfo();
      if (sourceMetaInfo.shortId === "Volume" && pane.containsMainSeries()) {
        return pane.createPriceScaleAtPosition(PriceScalePosition.Overlay);
      }

      const desiredPriceScalePosition =
        sourceMetaInfo.desiredPriceScalePosition();
      if (desiredPriceScalePosition !== null) {
        return this._tryToGetDesiredPriceScale(
          pane,
          source,
          desiredPriceScalePosition,
          sourceStudy
        );
      }

      if (
        sourceStudy !== undefined &&
        (isStudy(sourceStudy) || pane.isMainPane()) &&
        sourceMetaInfo.is_price_study
      ) {
        return this._getPriceScaleTheSameAsForSource(sourceStudy, pane);
      }
    }

    let isPriceStudy = false;
    if (isStudy(source)) {
      const groupingKey = source.metaInfo().groupingKey;
      if (groupingKey !== undefined) {
        const nonOverlayStudyWithGroupingKey = pane
          .model()
          .findNonOverlayStudyWithGroupingKey(groupingKey, pane);
        if (nonOverlayStudyWithGroupingKey !== null) {
          return this._getPriceScaleTheSameAsForSource(
            nonOverlayStudyWithGroupingKey.study,
            nonOverlayStudyWithGroupingKey.pane
          );
        }
      }
      isPriceStudy = Boolean(source.metaInfo().is_price_study);
    } else if (source === pane.model().mainSeries()) {
      isPriceStudy = true;
    }

    if (isPriceStudy) {
      const priceScale = this._findFirstScaleForPriceStudy(pane);
      if (priceScale !== null) {
        return priceScale;
      }
    }

    return this.createNewPriceScaleIfPossible(pane);
  }

  canCreateNewPriceScale(pane) {
    return (
      pane.leftPriceScales().length + pane.rightPriceScales().length <
      this._priceScalesLimit
    );
  }

  _getPriceScaleTheSameAsForSource(source, targetPane) {
    return targetPane.isOverlay(source)
      ? targetPane.createPriceScaleAtPosition(PriceScalePosition.Overlay)
      : ensureNotNull(source.priceScale());
  }

  _priceScaleIsPrice(priceScale, model) {
    const mainSource = priceScale.mainSource();
    return (
      !!mainSource &&
      (mainSource === model.mainSeries() ||
        (isStudy(mainSource) && Boolean(mainSource.metaInfo().is_price_study)))
    );
  }

  _findFirstScaleForPriceStudy(pane) {
    const model = pane.model();
    for (let i = 0; i < this._priceScalesLimit; i++) {
      if (
        pane.rightPriceScales().length > i &&
        this._priceScaleIsPrice(pane.rightPriceScales()[i], model)
      ) {
        return pane.rightPriceScales()[i];
      }
      if (
        pane.leftPriceScales().length > i &&
        this._priceScaleIsPrice(pane.leftPriceScales()[i], model)
      ) {
        return pane.leftPriceScales()[i];
      }
    }
    return null;
  }

  _targetPriceScaleIndex(priceScale, model) {
    if (priceScale.mainSource() === model.mainSeries()) {
      return 0;
    }
  }

  _tryToGetDesiredPriceScale(
    pane,
    source,
    targetPriceScalePosition,
    sourceStudy
  ) {
    switch (targetPriceScalePosition) {
      case PriceScalePosition.Left:
        return this.canCreateNewPriceScale(pane)
          ? pane.createPriceScaleAtPosition(PriceScalePosition.Left)
          : pane.createPriceScaleAtPosition(PriceScalePosition.Overlay);
      case PriceScalePosition.Right:
        return this.canCreateNewPriceScale(pane)
          ? pane.createPriceScaleAtPosition(PriceScalePosition.Right)
          : pane.createPriceScaleAtPosition(PriceScalePosition.Overlay);
      case PriceScalePosition.AsSeries:
        return sourceStudy !== undefined
          ? ensureNotNull(sourceStudy.priceScale())
          : pane.isMainPane()
          ? ensureNotNull(ensureNotNull(pane.mainDataSource()).priceScale())
          : this.createNewPriceScaleIfPossible(pane);
      case PriceScalePosition.Overlay:
        return pane.createPriceScaleAtPosition(PriceScalePosition.Overlay);
    }
  }
}

const allPriceScaleSelectionStrategyInfo = [
  {
    name: "left",
    title: t(null, undefined, "Left"),
    ctor: class extends PriceScaleSelectionStrategy {
      constructor(metaInfo) {
        super(metaInfo);
      }

      apply(pane) {
        const model = pane.model();
        pane
          .rightPriceScales()
          .slice(0)
          .forEach((priceScale) =>
            pane.movePriceScale(
              priceScale,
              PriceScalePosition.Left,
              this._targetPriceScaleIndex(priceScale, model)
            )
          );
      }

      createNewPriceScaleIfPossible(pane) {
        return this.canCreateNewPriceScale(pane)
          ? pane.createPriceScaleAtPosition(PriceScalePosition.Left)
          : pane.createPriceScaleAtPosition(PriceScalePosition.Overlay);
      }
    },
  },
  {
    name: "right",
    title: t(null, undefined, "Right"),
    ctor: class extends PriceScaleSelectionStrategy {
      constructor(metaInfo) {
        super(metaInfo);
      }

      apply(pane) {
        const model = pane.model();
        pane
          .leftPriceScales()
          .slice(0)
          .forEach((priceScale) =>
            pane.movePriceScale(
              priceScale,
              PriceScalePosition.Right,
              this._targetPriceScaleIndex(priceScale, model)
            )
          );
      }

      createNewPriceScaleIfPossible(pane) {
        return this.canCreateNewPriceScale(pane)
          ? pane.createPriceScaleAtPosition(PriceScalePosition.Right)
          : pane.createPriceScaleAtPosition(PriceScalePosition.Overlay);
      }
    },
  },
  {
    name: "auto",
    title: t(null, undefined, "Auto"),
    ctor: class extends PriceScaleSelectionStrategy {
      constructor(metaInfo) {
        super(metaInfo);
      }

      apply(pane) {
        if (pane.containsMainSeries()) {
          const mainDataSource = ensureNotNull(
            ensureNotNull(pane.mainDataSource())
          );
          const priceScale = ensureNotNull(mainDataSource.priceScale());
          pane.movePriceScale(priceScale, PriceScalePosition.Right, 0);
        }
        const model = pane.model();
        while (pane.leftPriceScales().length > pane.rightPriceScales().length) {
          const priceScale =
            pane.leftPriceScales()[pane.leftPriceScales().length - 1];
          pane.movePriceScale(
            priceScale,
            PriceScalePosition.Right,
            this._targetPriceScaleIndex(priceScale, model)
          );
        }
        while (
          pane.rightPriceScales().length - pane.leftPriceScales().length >
          1
        ) {
          const priceScale =
            pane.rightPriceScales()[pane.rightPriceScales().length - 1];
          pane.movePriceScale(
            priceScale,
            PriceScalePosition.Left,
            this._targetPriceScaleIndex(priceScale, model)
          );
        }
      }

      createNewPriceScaleIfPossible(pane) {
        if (!this.canCreateNewPriceScale(pane)) {
          return pane.createPriceScaleAtPosition(PriceScalePosition.Overlay);
        }
        const targetPosition =
          pane.leftPriceScales().length < pane.rightPriceScales().length
            ? PriceScalePosition.Left
            : PriceScalePosition.Right;
        return pane.createPriceScaleAtPosition(targetPosition);
      }
    },
  },
];

function createPriceScaleSelectionStrategy(name) {
  const selectedStrategy = ensureDefined(
    allPriceScaleSelectionStrategyInfo.find(
      (strategy) => strategy.name === name
    )
  );
  return new selectedStrategy.ctor(selectedStrategy);
}

export {
  allPriceScaleSelectionStrategyInfo,
  createPriceScaleSelectionStrategy,
};
