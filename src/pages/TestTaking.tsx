import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { ProtectedContent } from '@/components/ProtectedContent';

interface Question {
  id: number;
  type: 'single' | 'multiple' | 'number';
  text: string;
  image?: string;
  options?: string[];
}

const mockQuestions: Question[] = [
  {
    id: 1,
    type: 'single',
    text: 'Какой элемент является основным структурным компонентом HTML-документа?',
    options: ['<div>', '<html>', '<body>', '<head>']
  },
  {
    id: 2,
    type: 'multiple',
    text: 'Выберите языки программирования общего назначения:',
    options: ['Python', 'HTML', 'JavaScript', 'CSS', 'Java']
  },
  {
    id: 3,
    type: 'number',
    text: 'Сколько битов в одном байте?',
  }
];

export default function TestTaking() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const accessKey = localStorage.getItem('testAccessKey');
    if (!accessKey) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSingleChoice = (value: string) => {
    setAnswers({ ...answers, [mockQuestions[currentQuestion].id]: value });
  };

  const handleMultipleChoice = (option: string, checked: boolean) => {
    const current = answers[mockQuestions[currentQuestion].id] || [];
    if (checked) {
      setAnswers({ ...answers, [mockQuestions[currentQuestion].id]: [...current, option] });
    } else {
      setAnswers({ 
        ...answers, 
        [mockQuestions[currentQuestion].id]: current.filter((item: string) => item !== option) 
      });
    }
  };

  const handleNumberInput = (value: string) => {
    setAnswers({ ...answers, [mockQuestions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;
  const question = mockQuestions[currentQuestion];

  if (isFinished) {
    return (
      <ProtectedContent>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg text-center animate-scale-in">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <Icon name="CheckCircle" size={48} className="text-white" />
              </div>
              <CardTitle className="text-2xl">Тестирование завершено</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ваши ответы сохранены и будут проверены администратором.
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Вернуться на главную
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedContent>
    );
  }

  return (
    <ProtectedContent>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="border-b bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={24} className="text-primary" />
              <span className="font-semibold text-lg">Тест по программированию</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Clock" size={18} className={timeLeft < 300 ? 'text-destructive' : 'text-muted-foreground'} />
                <span className={`font-mono font-semibold ${timeLeft < 300 ? 'text-destructive' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Вопрос {currentQuestion + 1} из {mockQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {question.image && (
                <img 
                  src={question.image} 
                  alt="Question illustration" 
                  className="w-full rounded-lg border"
                />
              )}

              {question.type === 'single' && (
                <RadioGroup 
                  value={answers[question.id] || ''} 
                  onValueChange={handleSingleChoice}
                  className="space-y-3"
                >
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'multiple' && (
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={`option-${index}`}
                        checked={(answers[question.id] || []).includes(option)}
                        onCheckedChange={(checked) => handleMultipleChoice(option, checked as boolean)}
                      />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'number' && (
                <div className="space-y-2">
                  <Label htmlFor="number-input" className="text-base">Введите число:</Label>
                  <Input
                    id="number-input"
                    type="number"
                    placeholder="Ваш ответ..."
                    value={answers[question.id] || ''}
                    onChange={(e) => handleNumberInput(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <Icon name="ChevronLeft" size={18} className="mr-1" />
                  Назад
                </Button>
                
                {currentQuestion === mockQuestions.length - 1 ? (
                  <Button onClick={handleFinish} className="min-w-32">
                    Завершить тест
                    <Icon name="Check" size={18} className="ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="min-w-32">
                    Далее
                    <Icon name="ChevronRight" size={18} className="ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedContent>
  );
}
