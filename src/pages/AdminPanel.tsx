import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { ProtectedContent } from '@/components/ProtectedContent';

interface Test {
  id: string;
  title: string;
  duration: number;
  startDate: string;
  endDate: string;
  studentCount: number;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([
    {
      id: 'test-001',
      title: 'Основы программирования',
      duration: 60,
      startDate: '2025-01-15',
      endDate: '2025-01-20',
      studentCount: 25
    }
  ]);

  const [newTest, setNewTest] = useState({
    title: '',
    duration: 60,
    startDate: '',
    endDate: '',
    questions: [{ type: 'single', text: '', options: ['', '', '', ''] }]
  });

  const handleAddQuestion = () => {
    setNewTest({
      ...newTest,
      questions: [...newTest.questions, { type: 'single', text: '', options: ['', '', '', ''] }]
    });
  };

  const handleCreateTest = () => {
    const test: Test = {
      id: `test-${String(tests.length + 1).padStart(3, '0')}`,
      title: newTest.title,
      duration: newTest.duration,
      startDate: newTest.startDate,
      endDate: newTest.endDate,
      studentCount: 0
    };
    setTests([...tests, test]);
    setNewTest({
      title: '',
      duration: 60,
      startDate: '',
      endDate: '',
      questions: [{ type: 'single', text: '', options: ['', '', '', ''] }]
    });
  };

  return (
    <ProtectedContent>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="ShieldCheck" size={28} className="text-primary" />
              <div>
                <h1 className="font-bold text-xl">Панель администратора</h1>
                <p className="text-sm text-muted-foreground">Управление тестами и студентами</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Tabs defaultValue="tests" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="tests">Тесты</TabsTrigger>
              <TabsTrigger value="create">Создать</TabsTrigger>
              <TabsTrigger value="students">Студенты</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Активные тесты</CardTitle>
                  <CardDescription>Управление существующими тестами</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tests.map((test) => (
                    <Card key={test.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{test.title}</h3>
                              <Badge variant="secondary">ID: {test.id}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Icon name="Clock" size={16} className="text-muted-foreground" />
                                <span>{test.duration} минут</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Users" size={16} className="text-muted-foreground" />
                                <span>{test.studentCount} студентов</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                                <span>С {test.startDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" size={16} className="text-muted-foreground" />
                                <span>По {test.endDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Icon name="Edit" size={16} className="mr-1" />
                              Изменить
                            </Button>
                            <Button variant="outline" size="sm">
                              <Icon name="Key" size={16} className="mr-1" />
                              Ключи
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Создание нового теста</CardTitle>
                  <CardDescription>Заполните информацию о тесте</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="test-title">Название теста</Label>
                      <Input
                        id="test-title"
                        placeholder="Например: Основы математики"
                        value={newTest.title}
                        onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Длительность (минуты)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newTest.duration}
                        onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Количество вопросов</Label>
                      <Input type="number" value={newTest.questions.length} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start-date">Дата начала</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newTest.startDate}
                        onChange={(e) => setNewTest({ ...newTest, startDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date">Дата окончания</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newTest.endDate}
                        onChange={(e) => setNewTest({ ...newTest, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Вопросы теста</h3>
                      <Button onClick={handleAddQuestion} variant="outline" size="sm">
                        <Icon name="Plus" size={16} className="mr-1" />
                        Добавить вопрос
                      </Button>
                    </div>

                    {newTest.questions.map((question, qIndex) => (
                      <Card key={qIndex} className="border-dashed">
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-start gap-4">
                            <Badge variant="outline" className="mt-2">
                              #{qIndex + 1}
                            </Badge>
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <Label>Тип вопроса</Label>
                                <Select defaultValue="single">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="single">Одиночный выбор</SelectItem>
                                    <SelectItem value="multiple">Множественный выбор</SelectItem>
                                    <SelectItem value="number">Ввод числа</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Текст вопроса</Label>
                                <Textarea placeholder="Введите вопрос..." rows={2} />
                              </div>

                              {question.type === 'single' && (
                                <div className="space-y-2">
                                  <Label>Варианты ответов</Label>
                                  {question.options.map((_, oIndex) => (
                                    <Input
                                      key={oIndex}
                                      placeholder={`Вариант ${oIndex + 1}`}
                                      className="text-sm"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button onClick={handleCreateTest} className="w-full" size="lg">
                    <Icon name="CheckCircle" size={20} className="mr-2" />
                    Создать тест
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Управление студентами</CardTitle>
                  <CardDescription>Создание и редактирование ключей доступа</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input placeholder="Введите имя студента..." className="flex-1" />
                      <Button>
                        <Icon name="UserPlus" size={18} className="mr-2" />
                        Добавить студента
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Иванов Иван Иванович</p>
                          <p className="text-sm text-muted-foreground">Тест: Основы программирования</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <code className="px-3 py-1 bg-muted rounded text-sm font-mono">KEY-2025-A1B2C3</code>
                          <Button variant="ghost" size="sm">
                            <Icon name="Copy" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedContent>
  );
}
