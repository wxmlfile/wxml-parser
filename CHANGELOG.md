# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2022-03-24
### Added
- Add new ast type `WXAttributeInterpolation`
- Support parse `WXInterpolation` in `WXAttribute`
### Fixed
- Fix `WXScript` parse error when follow `WXText` and `WXInterpolation`

## [0.3.2] - 2022-01-15
### Fixed
- Add missing `name` property for `WXScript` node

## [0.3.1] - 2022-01-15
- No changing

## [0.3.0] - 2021-11-15
### Fixed
- Fix multiline `WXInterpolation` parse error

## [0.2.0] - 2021-10-22
### Added
- Add new ast type `WXInterpolation`
- Add new script `npm run puretest` for better debugging
- Add new property `name` for `WXStartTag`

### Fixed
- Fix `WXScript` parse error

## [0.1.1] - 2021-10-20
### Added
- Add `errors` visitor key for `parseForESLint`

## [0.1.0] - 2021-10-19
### Added
- Add more useful info on README.md

## [0.0.1] - 2021-10-19
### Added
- Add based @wxml/parser feature support

