import React, { useState, useEffect } from 'react';

import { Grid } from '@vitessce/styles';
import { isEqual } from 'lodash-es';

import {
  getSourceFromLoader,
  getMultiSelectionStats,
  toRgbUIString,
  DOMAINS,
} from '@vitessce/spatial-utils';
import ChannelOptions from './ChannelOptions.js';
import {
  ChannelSelectionDropdown,
  ChannelVisibilityCheckbox,
} from './shared-channel-controls.js';
import { ChannelSlider } from './RasterChannelController.js';


/**
 * Controller for the handling the colormapping sliders.
 * @prop {boolean} visibility Whether or not this channel is "on"
 * @prop {array} sliders Current slider ranges.
 * @prop {array} normalizer Normalization slider range.
 * @prop {array} color Current color for this channel.
 * @prop {array} domain Current max/min for this channel.
 * @prop {string} dimName Name of the dimensions this slider controls (usually "channel").
 * @prop {boolean} colormapOn Whether or not the colormap (viridis, magma etc.) is on.
 * @prop {object} channelOptions All available options for this dimension (i.e channel names).
 * @prop {function} handlePropertyChange Callback for when a property (color, slider etc.) changes.
 * @prop {function} handleChannelRemove When a channel is removed, this is called.
 * @prop {number} selectionIndices The current numeric index of the selection.
 */
function ColocationChannelController({
  visibility = false,
  sliders,
  normalizer,
  color,
  channels,
  channelId,
  domainType: newDomainType,
  theme,
  loader,
  colormapOn,
  channelOptions,
  handlePropertyChange,
  handleChannelRemove,
  selectionIndices,
  isLoading,
  use3d: newUse3d,
}) {
  const { dtype } = getSourceFromLoader(loader);
  const [domain, setDomain] = useState(null);
  const [domainType, setDomainType] = useState(null);
  const [use3d, setUse3d] = useState(null);
  const [selection, setSelection] = useState([
    { ...channels[selectionIndices[0]].selection },
  ]);

  const rgbColor = toRgbUIString(colormapOn, color, theme);

  useEffect(() => {
    // Use mounted to prevent state updates/re-renders after the component has been unmounted.
    // All state updates should happen within the mounted check.
    let mounted = true;
    if (dtype && loader && channels) {
      const selections = [{ ...channels[selectionIndices[0]].selection }];
      let domains;
      const hasDomainChanged = newDomainType !== domainType;
      const has3dChanged = use3d !== newUse3d;
      const hasSelectionChanged = !isEqual(selections, selection);
      if (hasDomainChanged || hasSelectionChanged || has3dChanged) {
        if (newDomainType === 'Full') {
          domains = [DOMAINS[dtype]];
          const [newDomain] = domains;
          if (mounted) {
            setDomain(newDomain);
            setDomainType(newDomainType);
            if (hasSelectionChanged) {
              setSelection(selections);
            }
            if (has3dChanged) {
              setUse3d(newUse3d);
            }
          }
        } else {
          getMultiSelectionStats({
            loader: loader.data,
            selections,
            use3d: newUse3d,
          }).then((stats) => {
            // eslint-disable-next-line prefer-destructuring
            domains = stats.domains;
            const [newDomain] = domains;
            if (mounted) {
              setDomain(newDomain);
              setDomainType(newDomainType);
              if (hasSelectionChanged) {
                setSelection(selections);
              }
              if (has3dChanged) {
                setUse3d(newUse3d);
              }
            }
          });
        }
      }
    }
    return () => {
      mounted = false;
    };
  }, [
    domainType,
    channels,
    channelId,
    loader,
    dtype,
    newDomainType,
    selection,
    newUse3d,
    use3d,
  ]);
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
              <Grid marginLeft={1}>
                <ChannelSlider
                  color="#FFFFFF"
                  slider={sliders[index]}
                  domain={domain || DOMAINS[dtype]}
                  dtype={dtype}
                  handleChange={v => handlePropertyChange('slider', v, index)}
                  disabled={isLoading}
                />
              </Grid>
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
