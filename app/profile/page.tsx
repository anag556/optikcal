"use client";

import { useState, useEffect } from "react";
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '../components/dashboardNav';
import { Pencil } from 'lucide-react';

type ProfileData = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  currentWeight: number;
  goalWeight: number;
  targetWeeks: number;
  activityLevel: string;
  maintenanceCalories: number;
  dailyCalorieTarget: number;
  macronutrients: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setTempValues(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValues(profile || {});
  };

  const handleChange = (field: string, value: string | number) => {
    setTempValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          ...tempValues
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setProfile(data.user);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">Error loading profile</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8 p-5">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <Card className="p-6 relative">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name field */}
                <div className="space-y-2">
                  <Label>Name</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'name' ? (
                      <>
                        <Input
                          value={tempValues.name || ''}
                          onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{profile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('name')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Age field */}
                <div className="space-y-2">
                  <Label>Age</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'age' ? (
                      <>
                        <Input
                          type="number"
                          value={tempValues.age || ''}
                          onChange={(e) => handleChange('age', Number(e.target.value))}
                        />
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{profile.age} years</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('age')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Gender field */}
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'gender' ? (
                      <>
                        <Select
                          value={tempValues.gender}
                          onValueChange={(value: 'male' | 'female' | 'other') => handleChange('gender', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg capitalize">{profile.gender}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('gender')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Height field */}
                <div className="space-y-2">
                  <Label>Height</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'height' ? (
                      <>
                        <Input
                          type="number"
                          value={tempValues.height || ''}
                          onChange={(e) => handleChange('height', Number(e.target.value))}
                        />
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{profile.height} cm</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('height')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Current Weight field */}
                <div className="space-y-2">
                  <Label>Current Weight</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'currentWeight' ? (
                      <>
                        <Input
                          type="number"
                          step="0.1"
                          value={tempValues.currentWeight || ''}
                          onChange={(e) => handleChange('currentWeight', Number(e.target.value))}
                        />
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{profile.currentWeight} kg</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('currentWeight')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Goal Weight field */}
                <div className="space-y-2">
                  <Label>Goal Weight</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'goalWeight' ? (
                      <>
                        <Input
                          type="number"
                          step="0.1"
                          value={tempValues.goalWeight || ''}
                          onChange={(e) => handleChange('goalWeight', Number(e.target.value))}
                        />
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{profile.goalWeight} kg</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('goalWeight')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Target Weeks field */}
                <div className="space-y-2">
                  <Label>Target Weeks</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'targetWeeks' ? (
                      <>
                        <Input
                          type="number"
                          value={tempValues.targetWeeks || ''}
                          onChange={(e) => handleChange('targetWeeks', Number(e.target.value))}
                        />
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">{profile.targetWeeks} weeks</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('targetWeeks')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Activity Level field */}
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <div className="flex items-center gap-2">
                    {editingField === 'activityLevel' ? (
                      <>
                        <Select
                          value={tempValues.activityLevel}
                          onValueChange={(value) => handleChange('activityLevel', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
                            <SelectItem value="light">Light (Exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderate">Moderate (Exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="active">Active (Exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="very-active">Very Active (Hard daily exercise & physical job)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="submit" size="sm">Save</Button>
                        <Button type="button" variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="text-lg capitalize">{profile.activityLevel.replace('-', ' ')}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit('activityLevel')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold">Calculated Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Maintenance Calories</Label>
                    <p className="text-lg">{profile.maintenanceCalories} kcal/day</p>
                  </div>
                  <div>
                    <Label>Daily Calorie Target</Label>
                    <p className="text-lg">{profile.dailyCalorieTarget} kcal/day</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-4">Macronutrients</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Protein</Label>
                    <p>{profile.macronutrients.protein}g</p>
                  </div>
                  <div>
                    <Label>Carbs</Label>
                    <p>{profile.macronutrients.carbs}g</p>
                  </div>
                  <div>
                    <Label>Fats</Label>
                    <p>{profile.macronutrients.fats}g</p>
                  </div>
                  <div>
                    <Label>Fiber</Label>
                    <p>{profile.macronutrients.fiber}g</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}