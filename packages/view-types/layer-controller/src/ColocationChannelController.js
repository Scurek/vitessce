import React from 'react';

import { Grid, Slider, InputLabel } from '@vitessce/styles';

import {
  toRgbUIString,
} from '@vitessce/spatial-utils';
import ChannelOptions from './ChannelOptions.js';
import {
  ChannelSelectionDropdown,
  ChannelVisibilityCheckbox,
} from './shared-channel-controls.js';
import { ChannelSlider } from './RasterChannelController.js';
import {
  useSelectStyles, useInputLabelStyles,
} from './styles.js';

/**
 * Controller for the handling the colormapping sliders.
 * @prop {boolean} visibility Whether or not this channel is "on"
 * @prop {number} opacity Current slider ranges.
 * @prop {array} normalizer Normalization slider range.
 * @prop {array} color Current color for this channel.
 * @prop {object} channelOptions All available options for this dimension (i.e channel names).
 * @prop {function} handlePropertyChange Callback for when a property (color, slider etc.) changes.
 * @prop {function} handleChannelRemove When a channel is removed, this is called.
 * @prop {number} selectionIndices The current numeric index of the selection.
 */
function ColocationChannelController({
  channelId,
  visibility = false,
  opacity,
  normalizer,
  color,
  theme,
  channelOptions,
  handlePropertyChange,
  handleChannelRemove,
  selectionIndices,
  isLoading,
}) {
  const { classes } = useSelectStyles();
  const { classes: inputLabelClasses } = useInputLabelStyles();
  const rgbColor = toRgbUIString(false, color, theme);

  /* A valid selection is defined by an object where the keys are
   *  the name of a dimension of the data, and the values are the
   *  index of the image along that particular dimension.
   *
   *  Since we currently only support making a selection along one
   *  addtional dimension (i.e. the dropdown just has channels or mz)
   *  we have a helper function to create the selection.
   *
   *  e.g { channel: 2 } // channel dimension, third channel
   */
  return (
    <Grid container direction="column" justifyContent="center">
      <Grid container direction="row" justifyContent="space-between">
        <Grid size={10} container direction="column">
          {selectionIndices.map((selectionIndex, index) => (
          // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <ChannelSelectionDropdown
                handleChange={v => handlePropertyChange('selection', v, index)}
                selectionIndex={selectionIndex}
                channelOptions={channelOptions}
                disabled={isLoading}
              />
            </div>
          ))}
        </Grid>
        <Grid size={1} container direction="column">
          <Grid size={1} sx={{ marginTop: '4px' }}>
            <ChannelOptions
              handlePropertyChange={handlePropertyChange}
              handleChannelRemove={handleChannelRemove}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="row" marginTop="8px" alignItems="center" justifyContent="space-between">
        <Grid size={3}>
          <InputLabel
            htmlFor={`colocation-controller-${channelId}-opacity`}
            classes={{ root: inputLabelClasses.inputLabelRoot }}
          >
            Opacity:
          </InputLabel>
        </Grid>
        <Grid size={8} display="flex">
          <Slider
            id={`colocation-controller-${channelId}-opacity`}
            slotProps={{ valueLabel: { className: classes.sliderValueLabel } }}
            value={opacity}
            onChange={(e, v) => handlePropertyChange('opacity', v)}
            valueLabelDisplay="auto"
            aria-label="Colocation opacity slider"
            min={0}
            max={1}
            step={0.01}
            orientation="horizontal"
          />
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="space-between">
        <Grid size={2}>
          <ChannelVisibilityCheckbox
            color={rgbColor}
            checked={visibility}
            toggle={() => handlePropertyChange('visible', !visibility)}
            disabled={isLoading}
          />
        </Grid>
        <Grid size={9}>
          <ChannelSlider
            color={rgbColor}
            slider={normalizer}
            domain={[0, 1]}
            dtype="Float"
            handleChange={v => handlePropertyChange('normalizer', v)}
            disabled={isLoading}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ColocationChannelController;
