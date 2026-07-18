import React from 'react';
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

globalThis.React = React;

expect.extend(toHaveNoViolations);
