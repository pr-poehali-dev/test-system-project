import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ProtectedContent } from '@/components/ProtectedContent';

export default function Login() {
  const [accessKey, setAccessKey] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey.trim()) {
      localStorage.setItem('testAccessKey', accessKey);
      navigate('/test');
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin');
  };

  return (
    <ProtectedContent>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
              <Icon name="GraduationCap" size={32} className="text-white" />
            </div>
            <CardTitle className="text-3xl">Система тестирования</CardTitle>
            <CardDescription className="text-base">
              Введите уникальный ключ доступа для начала тестирования
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessKey" className="text-sm font-medium">
                  Ключ доступа
                </Label>
                <Input
                  id="accessKey"
                  type="text"
                  placeholder="Введите ключ..."
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="h-12 text-lg"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg">
                Начать тестирование
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Администрирование</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-11"
              onClick={handleAdminLogin}
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Вход для администратора
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedContent>
  );
}
