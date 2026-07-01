param(
  [Parameter(Mandatory = $true)]
  [string]$ImagesRoot
)

Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
  [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } |
    Select-Object -First 1
}

function Save-Jpeg {
  param(
    [Parameter(Mandatory = $true)]
    [System.Drawing.Image]$Image,
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [Parameter(Mandatory = $true)]
    [int]$Quality
  )

  $encoder = Get-JpegEncoder
  $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters 1
  $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [int64]$Quality
  )
  $Image.Save($Path, $encoder, $encoderParameters)
  $encoderParameters.Dispose()
}

function Optimize-Jpeg {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [Parameter(Mandatory = $true)]
    [int]$MaxWidth,
    [Parameter(Mandatory = $true)]
    [int]$MaxHeight,
    [Parameter(Mandatory = $true)]
    [int]$Quality
  )

  $source = [System.Drawing.Image]::FromFile($Path)
  try {
    $ratio = [Math]::Min($MaxWidth / $source.Width, $MaxHeight / $source.Height)
    if ($ratio -gt 1) {
      $ratio = 1
    }

    $targetWidth = [Math]::Max(1, [int][Math]::Round($source.Width * $ratio))
    $targetHeight = [Math]::Max(1, [int][Math]::Round($source.Height * $ratio))
    $target = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
    try {
      $target.SetResolution(72, 72)
      $graphics = [System.Drawing.Graphics]::FromImage($target)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.DrawImage($source, 0, 0, $targetWidth, $targetHeight)
      }
      finally {
        $graphics.Dispose()
      }

      $tempPath = "$Path.tmp"
      Save-Jpeg -Image $target -Path $tempPath -Quality $Quality
    }
    finally {
      if ($target) {
        $target.Dispose()
      }
    }
  }
  finally {
    $source.Dispose()
  }

  Move-Item -LiteralPath $tempPath -Destination $Path -Force
}

$imageFiles = Get-ChildItem -LiteralPath $ImagesRoot -Recurse -File -Include *.jpg, *.jpeg

foreach ($file in $imageFiles) {
  $relativePath = $file.FullName.Substring($ImagesRoot.Length).TrimStart('\', '/')

  if ($relativePath -like 'banners*') {
    Optimize-Jpeg -Path $file.FullName -MaxWidth 900 -MaxHeight 450 -Quality 74
  }
  elseif ($file.Name -eq 'glassmartin-logo.jpg') {
    Optimize-Jpeg -Path $file.FullName -MaxWidth 512 -MaxHeight 512 -Quality 78
  }
  else {
    Optimize-Jpeg -Path $file.FullName -MaxWidth 520 -MaxHeight 520 -Quality 76
  }
}
