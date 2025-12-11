// src/types/cropper.types.ts

export interface CropperCoordinates {
  left: number
  top: number
  width: number
  height: number
}

export interface CropperTransforms {
  rotate: number
  flip: {
    horizontal: boolean
    vertical: boolean
  }
}

export interface CropperSettings {
  aspectRatio: number
  minWidth: number
  minHeight: number
  maxWidth?: number
  maxHeight?: number
}

export interface CropperResult {
  blob: Blob
  canvas: HTMLCanvasElement
  coordinates: CropperCoordinates
}