'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type FormData = {
  N: number
  P: number
  K: number
  temperature: number
  humidity: number
  pH: number
  rainfall: number
}

const cropList = [
  'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
  'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
  'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
  'apple', 'orange', 'papaya', 'coconut', 'cotton',
  'jute', 'coffee'
]

export default function CropRecommendationSystem() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    // Prepare the features array from form data
    const features = [
      data.N,
      data.P,
      data.K,
      data.temperature,
      data.humidity,
      data.pH,
      data.rainfall,
    ]

    try {
      const response = await fetch('https://crop-recommendation-backend-4va0.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      })

      if (!response.ok) {
        throw new Error('Failed to get recommendation')
      }

      const result = await response.json()
      // Map the prediction index to the corresponding crop name
      const cropName = cropList[result.prediction[0]]
      setResult(cropName) // Display the first prediction from the array
      setError(null)
    } catch (err) {
      setError('An error occurred while fetching the recommendation. Please try again. +' + err )
      setResult(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 sm:p-6 md:p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800 text-center mb-2">
          Smart Crop Recommendation System
        </h1>
        <p className="text-lg text-green-700 text-center mb-8">
          Enter soil and climate parameters to get the most suitable crop for your farm
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">Enter Farm Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="N">Nitrogen (N) content</Label>
                  <Input
                    id="N"
                    type="number"
                    placeholder="50"
                    step="0.01"
                    {...register('N', { required: true, min: 0 })}
                    className="mt-1"
                  />
                  {errors.N && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
                <div>
                  <Label htmlFor="P">Phosphorous (P) content</Label>
                  <Input
                    id="P"
                    type="number"
                    placeholder="50"
                    step="0.01"
                    {...register('P', { required: true, min: 0 })}
                    className="mt-1"
                  />
                  {errors.P && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
                <div>
                  <Label htmlFor="K">Potassium (K) content</Label>
                  <Input
                    id="K"
                    type="number"
                    placeholder="50"
                    step="0.01"
                    {...register('K', { required: true, min: 0 })}
                    className="mt-1"
                  />
                  {errors.K && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="25"
                    step="0.1"
                    {...register('temperature', { required: true })}
                    className="mt-1"
                  />
                  {errors.temperature && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
                <div>
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    placeholder="70"
                    step="0.1"
                    {...register('humidity', { required: true, min: 0, max: 100 })}
                    className="mt-1"
                  />
                  {errors.humidity && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
                <div>
                  <Label htmlFor="pH">pH value</Label>
                  <Input
                    id="pH"
                    type="number"
                    placeholder="6.5"
                    step="0.1"
                    {...register('pH', { required: true, min: 0, max: 14 })}
                    className="mt-1"
                  />
                  {errors.pH && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
                <div>
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="200"
                    step="0.1"
                    {...register('rainfall', { required: true, min: 0 })}
                    className="mt-1"
                  />
                  {errors.rainfall && <span className="text-red-500 text-sm">This field is required</span>}
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                Get Recommendation
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-2">Recommendation Result</h2>
              <p className="text-xl text-green-700">Recommended Crop: <span className="font-bold">{result}</span></p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold text-red-800 mb-2">Error</h2>
              <p className="text-xl text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
